import { databaseApi } from "../databaseApi";
import { KeysetCursor, ServerFeedResponse } from "@/definitions/api";
import { ImageUpdate } from "@/definitions/media";
import { TestimonyPost } from "@/definitions/posts";
import keysToCamel from "@/utility_functions/keysToCamel";

export interface BaseUserQueryArgs {
  userAuthId?: string; // The user's firebase auth id
}

const testimoniesApi = databaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimoniesFeed: builder.infiniteQuery<
      ServerFeedResponse<TestimonyPost>,
      BaseUserQueryArgs,
      KeysetCursor | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          const { data, hasMore } = lastPage;
          if (data && data.length === 0 && hasMore) {
            const { postId, timestamp } = data[data.length - 1];
            return { lastId: postId, lastTimestamp: timestamp };
          }
        },
      },
      query: ({ queryArg, pageParam }) => {
        let url = `feeds/testimonies?userAuthId=${queryArg.userAuthId}`;

        if (pageParam) {
          const { lastId, lastTimestamp } = pageParam;

          if (lastTimestamp && lastId) {
            url += `&lastTimestamp=${encodeURIComponent(lastTimestamp)}&lastId=${lastId}`;
          }
          return url;
        }

        return url;
      },
      providesTags: ["Testimonies"],
      transformResponse: (res: ServerFeedResponse<TestimonyPost>) => {
        const { hasMore, data } = res;
        const camelCasedData = keysToCamel(data) as TestimonyPost[];

        return {
          hasMore,
          data: camelCasedData.map((post) => ({
            ...post,
            postType: "testimony",
          })),
        };
      },
    }),
    getTestimony: builder.query<
      TestimonyPost,
      Pick<TestimonyPost, "postId"> & BaseUserQueryArgs
    >({
      query: ({ postId, userAuthId }) =>
        `posts/testimony/${postId}?userAuthId=${userAuthId}`,
      providesTags: (result, error, queryArg) => [
        { type: "Post", id: queryArg.postId },
      ],
      transformResponse: (res: TestimonyPost) => {
        const camelCasedData = keysToCamel(res) as TestimonyPost;
        camelCasedData.postType = "testimony";
        return camelCasedData;
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetTestimoniesFeedInfiniteQuery, useGetTestimonyQuery } =
  testimoniesApi;
