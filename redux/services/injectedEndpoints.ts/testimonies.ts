import { Testimony, TestimonyUpdateFields } from "@/firebaseConfig";
import {
  BasicStartAfterFieldValues,
  buildError,
  firestoreApi,
  QueryFieldValues,
} from "../firestore";
import {
  createTestimony,
  getTestimonies,
  updateTestimony,
} from "@/firebase_functions/testimonyFunctions";
import { getTestimony } from "@/firebase_functions/testimonyFunctions";
import { REPORT_THRESHOLD } from "@/firebase_functions/reportFunctions";
import { reportsApi } from "./reports";
import { createPost } from "@/firebase_functions/firebaseFunctions";
import { FirestoreErrorCode } from "firebase/firestore";
import { commentsApi } from "./comments";

const testimoniesApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    getTestimonies: build.infiniteQuery<
      Testimony[],
      BasicStartAfterFieldValues | undefined,
      BasicStartAfterFieldValues | undefined
    >({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          if (lastPage && lastPage.length > 0) {
            const { date, documentId } = lastPage[lastPage.length - 1];
            return { date, documentId };
          }
        },
      },
      queryFn: async ({ queryArg, pageParam }) => {
        try {
          let startAfterFieldValues: BasicStartAfterFieldValues | undefined;
          // Use queryArg for initial testimony retrieval when provided
          if (queryArg && !pageParam) {
            startAfterFieldValues = {
              date: queryArg.date,
              documentId: queryArg.documentId,
            };
            // Use pageParam for subsequent testimony retrieval requests
          } else if (pageParam) {
            startAfterFieldValues = {
              date: pageParam.date,
              documentId: pageParam.documentId,
            };
          }
          console.log("using: ", startAfterFieldValues);
          const data = await getTestimonies(startAfterFieldValues);
          console.log("data: ", data);

          return {
            data: data,
          };
        } catch (error) {
          return buildError(error);
        }
      },
      providesTags: () => ["Post", { type: "Testimony", id: "LIST" }],
      onQueryStarted: async (queryArgument, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;

          // Set the cache entry for individual testimony posts
          data.pages.forEach((testimonies) => {
            return testimonies.forEach((testimony) => {
              dispatch(
                testimoniesApi.util.upsertQueryData(
                  "getTestimony",
                  { documentId: testimony.documentId },
                  testimony,
                ),
              );
            });
          });
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getTestimony: build.query<Testimony | null, QueryFieldValues>({
      queryFn: async ({ documentId }) => {
        try {
          const data = await getTestimony(documentId);
          return {
            data: data,
          };
        } catch (error) {
          return buildError(error);
        }
      },
      providesTags: (result, error, queryArg) => [
        { type: "Testimony", id: queryArg.documentId },
        // Give a reported tag if the number of reports is >= to the report threshold.
        (result?.reports ?? 0 >= REPORT_THRESHOLD)
          ? { type: "Reported", id: "testimony" }
          : undefined,
      ],
    }),
    updateTestimony: build.mutation<
      boolean,
      { documentId: string; updatedFields: TestimonyUpdateFields }
    >({
      queryFn: async ({ documentId, updatedFields }) => {
        try {
          const wasSuccessful = await updateTestimony(
            documentId,
            updatedFields,
          );
          return {
            data: wasSuccessful,
          };
        } catch (error) {
          return buildError(error);
        }
      },
      onQueryStarted: async (
        { documentId, updatedFields },
        { queryFulfilled, dispatch },
      ) => {
        // Patch "getTestimonies" query list
        const listPatchResult = dispatch(
          testimoniesApi.util.updateQueryData(
            "getTestimonies",
            undefined,
            (draft) => {
              // Find post that needs to be updated
              draft.pages.forEach((postPage) => {
                const postIndex = postPage.findIndex(
                  (post) => post.documentId === documentId,
                );
                if (postIndex !== -1) {
                  Object.assign(postPage[postIndex], updatedFields);
                  return;
                }
              });
            },
          ),
        );

        // Patch "getTestimony" query
        const itemPatchResult = dispatch(
          testimoniesApi.util.updateQueryData(
            "getTestimony",
            { documentId },
            (draft) => {
              if (!draft) return;
              // Update post
              Object.assign(draft, updatedFields);
            },
          ),
        );

        // Patch "getReportedTestimonies" query list
        const reportListPatchResult = dispatch(
          reportsApi.util.updateQueryData(
            "getReportedTestimonies",
            undefined,
            (draft) => {
              // Find post that needs to be updated
              draft.pages.forEach((postPage) => {
                const postIndex = postPage.findIndex(
                  (post) => post.documentId === documentId,
                );
                if (postIndex !== -1) {
                  Object.assign(postPage[postIndex], updatedFields);
                  return;
                }
              });
            },
          ),
        );

        try {
          const { data } = await queryFulfilled;
          if (!data) {
            listPatchResult.undo();
            itemPatchResult.undo();
            reportListPatchResult.undo();
          }
        } catch {
          listPatchResult.undo();
          itemPatchResult.undo();
          reportListPatchResult.undo();
        }
      },
    }),
    createTestimony: build.mutation<Testimony, { title: string; body: string }>(
      {
        queryFn: async ({ title, body }) => {
          try {
            const testimony = await createTestimony(title, body);
            if (!testimony) {
              throw "Error occurred while creating testimony.";
            }
            return {
              data: testimony,
            };
          } catch (error) {
            return buildError(error);
          }
        },
        onQueryStarted: async (queryArgs, { queryFulfilled, dispatch }) => {
          try {
            // Pessimistic cache update
            const { data } = await queryFulfilled;
            const { documentId } = data;

            // Patch "getTestimonies" query list
            dispatch(
              testimoniesApi.util.updateQueryData(
                "getTestimonies",
                undefined,
                (draft) => {
                  // Add post to beginning of array
                  if (draft.pages.length > 0) {
                    draft.pages[0].unshift(data);
                  }
                },
              ),
            );

            // Patch "getTestimony" query
            dispatch(
              testimoniesApi.util.upsertQueryData(
                "getTestimony",
                { documentId: documentId },
                data,
              ),
            );

            // Patch "getComments" query
            dispatch(
              commentsApi.util.upsertQueryData(
                "getComments",
                { fieldValues: { documentId }, postType: "testimony" },
                { pages: [[]], pageParams: [] },
              ),
            );
          } catch {
            return;
          }
        },
      },
    ),
  }),
  overrideExisting: true,
});

export const {
  useGetTestimoniesInfiniteQuery,
  useGetTestimonyQuery,
  useUpdateTestimonyMutation,
  useCreateTestimonyMutation,
} = testimoniesApi;
