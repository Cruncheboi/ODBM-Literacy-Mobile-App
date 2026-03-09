import { Comment, Testimony } from "@/firebaseConfig";
import {
  BasicStartAfterFieldValues,
  firestoreApi,
  QueryFieldValues,
} from "../firestore";
import { getTestimonies } from "@/firebase_functions/firebaseFunctions";
import { FirebaseError } from "firebase/app";
import { getTestimony } from "@/firebase_functions/testimonyFunctions";
import { REPORT_THRESHOLD } from "@/firebase_functions/reportFunctions";
import { getComment, getComments } from "@/firebase_functions/commentFunctions";

const extendedApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    getComments: build.infiniteQuery<
      Comment[],
      QueryFieldValues,
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
          // Use pageParam for subsequent comment retrieval requests
          if (pageParam) {
            startAfterFieldValues = {
              date: pageParam.date,
              documentId: pageParam.documentId,
            };
          }
          console.log("using: ", startAfterFieldValues);
          const data = await getComments(
            queryArg.documentId,
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
      providesTags: (result, error, queryArg) => [
        "Post",
        { type: "Comment", id: queryArg.documentId },
      ],
    }),
    getComment: build.query<Comment | null, { documentId: string }>({
      queryFn: async ({ documentId }) => {
        try {
          const data = await getComment(documentId);
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
        { type: "Reported", id: queryArg.documentId },
        (result?.reports ?? 0 >= REPORT_THRESHOLD)
          ? { type: "Reported", id: "comment" }
          : undefined,
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetCommentsInfiniteQuery, useGetCommentQuery } = extendedApi;
