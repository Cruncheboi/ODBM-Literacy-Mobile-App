import { Testimony, TestimonyUpdateFields } from "@/firebaseConfig";
import { BasicStartAfterFieldValues, firestoreApi } from "../firestore";
import {
  getTestimonies,
  updateTestimony,
} from "@/firebase_functions/testimonyFunctions";
import { FirebaseError } from "firebase/app";
import { getTestimony } from "@/firebase_functions/testimonyFunctions";
import { REPORT_THRESHOLD } from "@/firebase_functions/reportFunctions";

const extendedApi = firestoreApi.injectEndpoints({
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
          console.log(error);
          return { error: error };
        }
      },
      providesTags: () => ["Post", { type: "Testimony", id: "LIST" }],
    }),
    getTestimony: build.query<Testimony | null, { documentId: string }>({
      queryFn: async ({ documentId }) => {
        try {
          const data = await getTestimony(documentId);
          return {
            data: data,
          };
        } catch (error) {
          if (error instanceof FirebaseError) {
            return {
              error: {
                code: error.code,
                message: error.message,
              },
            };
          }

          return { error: "An unknown error occured." };
        }
      },
      providesTags: (result, error, queryArg) => [
        { type: "Testimony", id: queryArg.documentId },
        ,
        (result?.reports ?? 0 >= REPORT_THRESHOLD)
          ? { type: "Reported", id: "testimony" }
          : undefined,
      ],
    }),
    updateTestimony: build.mutation<
      boolean,
      { documentId: string; udpatedFields: TestimonyUpdateFields }
    >({
      queryFn: async ({ documentId, udpatedFields }) => {
        try {
          const wasSuccessful = await updateTestimony(
            documentId,
            udpatedFields,
          );
          return {
            data: wasSuccessful,
          };
        } catch (error) {
          if (error instanceof FirebaseError) {
            return {
              error: {
                code: error.code,
                message: error.message,
              },
            };
          }
          return { error: "An unknown error occured." };
        }
      },
      invalidatesTags: (result, error, arg, meta) => {
        return [
          { type: "Testimony", id: arg.documentId },
          { type: "Testimony", id: "LIST" },
        ];
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTestimoniesInfiniteQuery,
  useGetTestimonyQuery,
  useUpdateTestimonyMutation,
} = extendedApi;
