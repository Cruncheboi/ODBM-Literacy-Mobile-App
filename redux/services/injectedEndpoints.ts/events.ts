import { Event, EventUpdateFields, Testimony } from "@/firebaseConfig";
import {
  BasicStartAfterFieldValues,
  buildError,
  firestoreApi,
} from "../firestore";
import { FirebaseError } from "firebase/app";
import { getTestimony } from "@/firebase_functions/testimonyFunctions";
import {
  createEvent,
  getEvent,
  getEvents,
  updateEvent,
} from "@/firebase_functions/eventFunctions";
import { REPORT_THRESHOLD } from "@/firebase_functions/reportFunctions";
import { reportsApi } from "./reports";
import { commentsApi } from "./comments";

const eventsApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    getEvents: build.infiniteQuery<
      Event[],
      BasicStartAfterFieldValues | undefined,
      BasicStartAfterFieldValues | undefined
    >({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          if (lastPage && lastPage.length > 0) {
            const { date, documentId } = lastPage[lastPage.length - 1];
            console.log(date, " ", documentId);
            return { date, documentId };
          }
        },
      },
      queryFn: async ({ queryArg, pageParam }) => {
        try {
          let startAfterFieldValues: BasicStartAfterFieldValues | undefined;
          // Use queryArg for initial event retrieval when provided
          if (queryArg && !pageParam) {
            startAfterFieldValues = {
              date: queryArg.date,
              documentId: queryArg.documentId,
            };
            // Use pageParam for subsequent event retrieval requests
          } else if (pageParam) {
            startAfterFieldValues = {
              date: pageParam.date,
              documentId: pageParam.documentId,
            };
          }
          console.log("using: ", startAfterFieldValues);
          const data = await getEvents(startAfterFieldValues);
          console.log("data: ", data);

          return {
            data: data,
          };
        } catch (error) {
          return buildError(error);
        }
      },
      providesTags: () => ["Post", { type: "Event", id: "LIST" }],
    }),
    getEvent: build.query<Event | null, { documentId: string }>({
      queryFn: async ({ documentId }) => {
        try {
          const data = await getEvent(documentId);
          return {
            data: data,
          };
        } catch (error) {
          return buildError(error);
        }
      },
      providesTags: (result, error, queryArg) => [
        { type: "Event", id: queryArg.documentId },
        // Give a reported tag if the number of reports is >= to the report threshold.
        (result?.reports ?? 0 >= REPORT_THRESHOLD)
          ? { type: "Reported", id: "event" }
          : undefined,
      ],
    }),
    updateEvent: build.mutation<
      boolean,
      { documentId: string; updatedFields: EventUpdateFields }
    >({
      queryFn: async ({ documentId, updatedFields }) => {
        try {
          const wasSuccessful = await updateEvent(documentId, updatedFields);
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
        // Patch "getEvents" query list
        const listPatchResult = dispatch(
          eventsApi.util.updateQueryData("getEvents", undefined, (draft) => {
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
          }),
        );

        // Patch "getEvent" query
        const itemPatchResult = dispatch(
          eventsApi.util.updateQueryData(
            "getEvent",
            { documentId },
            (draft) => {
              if (!draft) return;
              // Update post
              Object.assign(draft, updatedFields);
            },
          ),
        );

        // Patch "getReportedEvents" query list
        const reportListPatchResult = dispatch(
          reportsApi.util.updateQueryData(
            "getReportedEvents",
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
    createEvent: build.mutation<Event, { title: string; body: string }>({
      queryFn: async ({ title, body }) => {
        try {
          const event = await createEvent(title, body);
          if (!event) {
            throw "Error occurred while creating event.";
          }
          return {
            data: event,
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

          // Patch "getEvents" query list
          dispatch(
            eventsApi.util.updateQueryData("getEvents", undefined, (draft) => {
              // Add post to beginning of array
              if (draft.pages.length > 0) {
                draft.pages[0].unshift(data);
              }
            }),
          );

          // Patch "getEvent" query
          dispatch(
            eventsApi.util.upsertQueryData(
              "getEvent",
              { documentId: documentId },
              data,
            ),
          );

          // Patch "getComments" query
          dispatch(
            commentsApi.util.upsertQueryData(
              "getComments",
              { fieldValues: { documentId }, postType: "event" },
              { pages: [], pageParams: [] },
            ),
          );
        } catch {
          return;
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetEventsInfiniteQuery,
  useGetEventQuery,
  useUpdateEventMutation,
  useCreateEventMutation,
} = eventsApi;
