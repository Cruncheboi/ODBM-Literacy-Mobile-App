import { CommentPost } from "@/definitions/comments";
import { databaseApi } from "../databaseApi";
import { KeysetCursor, ServerFeedResponse } from "@/definitions/api";
import keysToCamel from "@/utility_functions/keysToCamel";

export interface CommentFeedQueryArgs {
  postId: number;
  userAuthId?: string; // The user's firebase auth id
}

// interface CommentParentArg {
//   parentPostType: PostType;
// }

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
          if (data && data.length === 0 && hasMore) {
            const { commentId, timestamp } = data[data.length - 1];
            return { lastId: commentId, lastTimestamp: timestamp };
          }
        },
      },
      query: ({ pageParam, queryArg }) => {
        const { userAuthId, postId } = queryArg;
        let url = `feeds/comments/${postId}?userAuthId=${userAuthId}`;

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
        const { hasMore, data } = res;
        const camelCasedData = keysToCamel(data) as CommentPost[];

        return {
          hasMore,
          data: camelCasedData.map((comment) => ({
            ...comment,
            postType: "comment",
          })),
        };
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
      invalidatesTags: (result, error, arg) => [
        { type: "Comments", id: arg.postId },
      ],
    }),
    updateComment: builder.mutation<
      void,
      Pick<CommentPost, "commentId" | "body" | "postId">
    >({
      query: ({ commentId, body }) => ({
        url: `comments/${commentId}`,
        method: "PUT",
        body: { body },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Comments", id: arg.postId },
      ],
    }),
    deleteComment: builder.mutation<
      Pick<CommentPost, "commentId" | "postId">,
      Pick<CommentPost, "commentId" | "postId">
    >({
      query: ({ commentId }) => ({
        url: `comments/${commentId}/delete`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Comments", id: arg.postId },
      ],
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

// const getCommentCacheType = (postType: PostType) => {
//   if (postType === "testimony") {
//     return "TestimonyComments" as const;
//   }
//   return "EventComments" as const;
// };
