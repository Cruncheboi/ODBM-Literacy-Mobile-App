import { databaseApi } from "../databaseApi";
import { KeysetCursor, ServerFeedResponse } from "@/definitions/api";
import { ImageUpdate } from "@/definitions/media";
import { EventPost } from "@/definitions/posts";
import keysToCamel from "@/utility_functions/keysToCamel";

export interface EventFeedQueryArgs {
  userAuthId?: string; // The user's firebase auth id
}

const eventsApi = databaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEventsFeed: builder.infiniteQuery<
      ServerFeedResponse<EventPost>,
      EventFeedQueryArgs,
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
        let url = `feeds/events?userAuthId=${queryArg.userAuthId}`;

        if (pageParam) {
          const { lastId, lastTimestamp } = pageParam;

          if (lastTimestamp && lastId) {
            url += `&lastTimestamp=${encodeURIComponent(lastTimestamp)}&lastId=${lastId}`;
          }
          return url;
        }

        return url;
      },
      providesTags: ["Events"],
      transformResponse: (res: ServerFeedResponse<EventPost>) => {
        const { hasMore, data } = res;
        const camelCasedData = keysToCamel(data) as EventPost[];

        return {
          hasMore,
          data: camelCasedData.map((post) => ({
            ...post,
            postType: "event",
          })),
        };
      },
    }),
    getEvent: builder.query<
      EventPost,
      Pick<EventPost, "postId"> & EventFeedQueryArgs
    >({
      query: ({ postId, userAuthId }) =>
        `posts/event/${postId}?userAuthId=${userAuthId}`,
      providesTags: (result, error, queryArg) => [
        { type: "Post", id: queryArg.postId },
      ],
      transformResponse: (res: EventPost) => {
        const camelCasedData = keysToCamel(res) as EventPost;
        camelCasedData.postType = "event";
        return camelCasedData;
      },
    }),
  }),

  overrideExisting: true,
});

export const { useGetEventsFeedInfiniteQuery, useGetEventQuery } = eventsApi;
