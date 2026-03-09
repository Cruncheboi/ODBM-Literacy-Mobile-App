import { Event, Testimony } from "@/firebaseConfig";
import { BasicStartAfterFieldValues, firestoreApi } from "../firestore";
import { FirebaseError } from "firebase/app";
import { getTestimony } from "@/firebase_functions/testimonyFunctions";
import { getEvent, getEvents } from "@/firebase_functions/eventFunctions";
import { REPORT_THRESHOLD } from "@/firebase_functions/reportFunctions";

const extendedApi = firestoreApi.injectEndpoints({
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
          console.log(error);
          return { error: error };
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
        { type: "Event", id: queryArg.documentId },
        (result?.reports ?? 0 >= REPORT_THRESHOLD)
          ? { type: "Reported", id: "event" }
          : undefined,
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetEventsInfiniteQuery, useGetEventQuery } = extendedApi;
