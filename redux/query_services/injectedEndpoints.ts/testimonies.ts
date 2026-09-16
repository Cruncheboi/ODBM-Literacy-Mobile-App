import { databaseApi } from "../databaseApi";
import { KeysetCursor, ServerFeedResponse } from "@/definitions/api";
import { TestimonyPost } from "@/definitions/posts";
import keysToCamel from "@/utility_functions/keysToCamel";

export interface TestimonyFeedQueryArgs {
  userId?: string; // The user's firebase auth id
}

const testimoniesApi = databaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimoniesFeed: builder.infiniteQuery<
      ServerFeedResponse<TestimonyPost>,
      TestimonyFeedQueryArgs,
      KeysetCursor | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          const { data, hasMore } = lastPage;
          if (data && hasMore) {
            const { postId, timestamp } = data[data.length - 1];
            return { lastId: postId, lastTimestamp: timestamp };
          }
        },
      },
      query: ({ queryArg, pageParam }) => {
        let url = `feeds/testimonies?userId=${queryArg.userId}`;

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
      // onQueryStarted: async (queryArgument, { queryFulfilled, dispatch }) => {
      //   try {
      //     const { data } = await queryFulfilled;

      //     // Set the cache entry for individual testimony posts
      //     data.pages.forEach((testimonies) => {
      //       return testimonies.forEach((testimony) => {
      //         dispatch(
      //           testimoniesApi.util.upsertQueryData(
      //             "getTestimony",
      //             { userId:  },
      //             testimony,
      //           ),
      //         );
      //       });
      //     });
      //   } catch (error) {
      //     console.log(error);
      //   }
      // },
    }),
    getTestimony: builder.query<
      TestimonyPost,
      Pick<TestimonyPost, "postId"> & TestimonyFeedQueryArgs
    >({
      query: ({ postId, userId }) =>
        `posts/testimony/${postId}?userId=${userId}`,
      providesTags: (result, error, queryArg) => [
        { type: "Testimony", id: queryArg.postId },
      ],
      transformResponse: (res: TestimonyPost) => {
        const camelCasedData = keysToCamel(res) as TestimonyPost;
        camelCasedData.postType = "testimony";
        return camelCasedData;
      },
    }),
    createTestimony: builder.mutation<
      Pick<TestimonyPost, "postId">,
      Pick<TestimonyPost, "title" | "body"> &
        Partial<Pick<TestimonyPost, "images">>
    >({
      query: (newPostData) => ({
        url: "posts/testimony",
        method: "POST",
        body: newPostData,
      }),
      invalidatesTags: ["Testimonies"],
      transformResponse: (res: { post_id: string }, meta, arg) => {
        return {
          postId: res.post_id,
        };
      },
    }),
    updateTestimony: builder.mutation<
      void,
      Partial<Pick<TestimonyPost, "title" | "body" | "images">> &
        Pick<TestimonyPost, "postId">
    >({
      query: ({ postId, title, body, images }) => ({
        url: `/posts/testimony/${postId}`,
        method: "PATCH",
        body: { postId, title, body, images },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTestimoniesFeedInfiniteQuery,
  useGetTestimonyQuery,
  useCreateTestimonyMutation,
  useUpdateTestimonyMutation,
} = testimoniesApi;
