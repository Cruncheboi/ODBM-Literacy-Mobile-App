import { Comment, CommentUpdateFields, PostType } from "@/firebaseConfig";
import {
  BasicStartAfterFieldValues,
  firestoreApi,
  buildError,
  QueryFieldValues,
} from "../firestore";
import { FirebaseError } from "firebase/app";
import { REPORT_THRESHOLD } from "@/firebase_functions/reportFunctions";
import {
  createComment,
  deleteComment,
  getComment,
  getComments,
  updateComment,
} from "@/firebase_functions/commentFunctions";
import Toast from "react-native-toast-message";
import { reportsApi } from "./reports";
import { documentId } from "firebase/firestore";

export const commentsApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    getComments: build.infiniteQuery<
      Comment[],
      { fieldValues: QueryFieldValues; postType: PostType },
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
            queryArg.fieldValues.documentId,
            queryArg.postType,
            startAfterFieldValues,
          );
          console.log("data: ", data);

          return {
            data: data,
          };
        } catch (error) {
          return buildError(error);
        }
      },
      providesTags: (result, error, { fieldValues, postType }) =>
        result
          ? [
              // Provides a "(postType)Comments" tag with an id of the post it originates from
              {
                type:
                  postType === "event" ? "EventComments" : "TestimonyComments",
                id: fieldValues.documentId,
              },
              // Creates tags for each comment with the id being
              // their respective document id
              ...result.pages.flatMap((comments) =>
                comments.map((comment) => ({
                  type: "Comment" as const,
                  id: comment.documentId,
                })),
              ),
            ]
          : [
              {
                type:
                  postType === "event" ? "EventComments" : "TestimonyComments",
                id: fieldValues.documentId,
              },
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
          return buildError(error);
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
      {
        postId: string;
        documentId: string;
        updatedFields: CommentUpdateFields;
        reports: number;
        postType: PostType;
      }
    >({
      queryFn: async ({ documentId, updatedFields }) => {
        try {
          const wasSuccessful = await updateComment(documentId, updatedFields);
          return {
            data: wasSuccessful,
          };
        } catch (error) {
          return buildError(error);
        }
      },
      onQueryStarted: async (
        { documentId, updatedFields, postId, postType, reports },
        { queryFulfilled, dispatch },
      ) => {
        // Patch "getComments" query list
        const listPatchResult = dispatch(
          commentsApi.util.updateQueryData(
            "getComments",
            { fieldValues: { documentId: postId }, postType },
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

        // Patch "getComment" query
        const itemPatchResult = dispatch(
          commentsApi.util.updateQueryData(
            "getComment",
            { documentId },
            (draft) => {
              if (!draft) return;
              // Update post
              Object.assign(draft, updatedFields);
            },
          ),
        );

        // Patch "getReportedComments" query list
        const reportListPatchResult = dispatch(
          reportsApi.util.updateQueryData(
            "getReportedComments",
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
    createComment: build.mutation<
      Comment,
      { postId: string; body: string; postType: PostType }
    >({
      queryFn: async ({ postId, body, postType }) => {
        try {
          const comment = await createComment(postId, body, postType);
          if (!comment) {
            throw "Error occurred while creating comment.";
          }
          return {
            data: comment,
          };
        } catch (error) {
          return buildError(error);
        }
      },
      onQueryStarted: async (
        { postId, postType },
        { queryFulfilled, dispatch },
      ) => {
        try {
          const { data } = await queryFulfilled;

          // Patch "getComments" query
          dispatch(
            commentsApi.util.updateQueryData(
              "getComments",
              { fieldValues: { documentId: postId }, postType },
              (draft) => {
                if (draft.pages.length > 0) {
                  draft.pages[0].unshift(data);
                }
              },
            ),
          );
        } catch {
          return;
        }
      },
    }),
    deleteComment: build.mutation<
      boolean,
      {
        documentId: string;
        postId: string;
        reports: number;
        postType: PostType;
      }
    >({
      queryFn: async ({ documentId }) => {
        try {
          const wasSuccessful = await deleteComment(documentId);

          Toast.show({
            type: "success",
            text1: "Comment successfully deleted.",
          });
          return {
            data: wasSuccessful,
          };
        } catch (error) {
          return buildError(error);
        }
      },
      onQueryStarted: async (
        { documentId, postId, postType },
        { queryFulfilled, dispatch },
      ) => {
        // Patch "getComments" query
        const listPatchResult = dispatch(
          commentsApi.util.updateQueryData(
            "getComments",
            { fieldValues: { documentId: postId }, postType },
            (draft) => {
              // Find and remove comment
              draft.pages.forEach((page) => {
                const itemIndex = page.findIndex(
                  (comment) => comment.documentId === documentId,
                );
                if (itemIndex !== -1) {
                  page.splice(itemIndex, 1);
                  return;
                }
              });
            },
          ),
        );

        // Patch "getComment" query
        const itemPatchResult = dispatch(
          commentsApi.util.updateQueryData(
            "getComment",
            { documentId },
            (draft) => {
              draft = null;
            },
          ),
        );

        // Patch "getReportedComments" query
        const reportListPatchResult = dispatch(
          reportsApi.util.updateQueryData(
            "getReportedComments",
            undefined,
            (draft) => {
              // Find and remove comment
              draft.pages.forEach((page) => {
                const itemIndex = page.findIndex(
                  (comment) => comment.documentId === documentId,
                );
                if (itemIndex !== -1) {
                  page.splice(itemIndex, 1);
                  return;
                }
              });
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          listPatchResult.undo();
          itemPatchResult.undo();
          reportListPatchResult.undo();
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCommentsInfiniteQuery,
  useGetCommentQuery,
  useUpdateCommentMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
