import { Comment, CommentUpdateFields } from "@/firebaseConfig";
import {
  BasicStartAfterFieldValues,
  firestoreApi,
  QueryFieldValues,
} from "../firestore";
import { FirebaseError } from "firebase/app";
import { REPORT_THRESHOLD } from "@/firebase_functions/reportFunctions";
import {
  getComment,
  getComments,
  updateComment,
} from "@/firebase_functions/commentFunctions";

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
      providesTags: (result, error, queryArg) =>
        result
          ? [
              // Provides a CommentList tag with an id of the post it originates from
              { type: "CommentList", id: queryArg.documentId },
              // Creates tags for each comment with the id being
              // their respective document id
              ...result.pages.flatMap((comments) =>
                comments.map((comment) => ({
                  type: "Comment" as const,
                  id: comment.documentId,
                })),
              ),
            ]
          : [{ type: "CommentList", id: queryArg.documentId }],
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
        { type: "Comment", id: queryArg.documentId },
        // Give a reported tag if the number of reports is >= to the report threshold.
        (result?.reports ?? 0 >= REPORT_THRESHOLD)
          ? { type: "Reported", id: "comment" }
          : undefined,
      ],
    }),
    updateComment: build.mutation<
      boolean,
      { postId: string; documentId: string; udpatedFields: CommentUpdateFields }
    >({
      queryFn: async ({ documentId, udpatedFields }) => {
        try {
          const wasSuccessful = await updateComment(documentId, udpatedFields);
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
      invalidatesTags: (result, error, arg) => [
        { type: "Reported", id: "comment" },
        // Invalidate comments from post where comment originates from
        { type: "CommentList", id: arg.postId },
        // Invalidate specific comment using document id
        { type: "Comment", id: arg.documentId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCommentsInfiniteQuery,
  useGetCommentQuery,
  useUpdateCommentMutation,
} = extendedApi;
