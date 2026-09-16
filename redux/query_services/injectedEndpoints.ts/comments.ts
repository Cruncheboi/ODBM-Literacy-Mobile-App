import { CommentPost } from "@/definitions/comments";
import { databaseApi } from "../databaseApi";
import { KeysetCursor, ServerFeedResponse } from "@/definitions/api";
import keysToCamel from "@/utility_functions/keysToCamel";

export interface CommentFeedQueryArgs {
  postId: string;
  userId?: string; // The user's firebase auth id
}

const commentsApi = databaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsFeed: builder.infiniteQuery<
      ServerFeedResponse<CommentPost>,
      CommentFeedQueryArgs,
      KeysetCursor | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          const { data, hasMore } = lastPage;
          if (data && hasMore) {
            const { commentId, timestamp } = data[data.length - 1];
            return { lastId: commentId, lastTimestamp: timestamp };
          }
        },
      },
      query: ({ pageParam, queryArg }) => {
        const { userId, postId } = queryArg;
        let url = `feeds/comments/${postId}?userId=${userId}`;

        if (pageParam) {
          const { lastId, lastTimestamp } = pageParam;

          if (lastTimestamp && lastId) {
            url += `&lastTimestamp=${encodeURIComponent(lastTimestamp)}&lastId=${lastId}`;
          }
          return url;
        }

        return url;
      },
      providesTags: (result, error, { postId }) => [
        {
          type: "Comments" as const,
          id: postId,
        },
      ],
      transformResponse: (res: ServerFeedResponse<CommentPost>) => {
        return keysToCamel(res);
      },
    }),
    createComment: builder.mutation<
      Pick<CommentPost, "commentId">,
      Pick<CommentPost, "body" | "postId">
    >({
      query: (commentParams) => ({
        url: "comments",
        method: "POST",
        body: commentParams,
      }),
    }),
    updateComment: builder.mutation<
      void,
      Pick<CommentPost, "commentId" | "body">
    >({
      query: ({ commentId, body }) => ({
        url: `comments/${commentId}`,
        method: "PUT",
        body: { body },
      }),
    }),
    deleteComment: builder.mutation<
      Pick<CommentPost, "commentId" | "postId">,
      Pick<CommentPost, "commentId">
    >({
      query: ({ commentId }) => ({
        url: `comments/${commentId}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCommentsFeedInfiniteQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
