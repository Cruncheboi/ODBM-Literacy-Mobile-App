import { Testimony } from "@/firebaseConfig";
import {
  BasicStartAfterFieldValues,
  firestoreApi,
  QueryFieldValues,
} from "../firestore";
import { getTestimonies } from "@/firebase_functions/firebaseFunctions";

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
          // console.log(lastPage[0].body);
          if (lastPage && lastPage.length > 0) {
            // if () return undefined;
            const { date, documentId } = lastPage[lastPage.length - 1];
            console.log(date, " ", documentId);
            // console.log("first: ", lastPage[0].date, " ", lastPage[0].documentId);
            return { date, documentId };
          }
          // return undefined;
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
          const [data, lastVisibleDoc] = await getTestimonies(
            undefined,
            startAfterFieldValues,
          );
          console.log("data: ", data);

          return {
            data: data,
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      providesTags: () => ["Post", "Testimony"],
      serializeQueryArgs: ({ queryArgs }) => queryArgs?.documentId ?? "",
    }),
  }),
  overrideExisting: true,
});

export const { useGetTestimoniesInfiniteQuery } = extendedApi;
