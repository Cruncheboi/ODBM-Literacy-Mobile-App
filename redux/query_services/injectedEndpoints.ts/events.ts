import { databaseApi } from "../databaseApi";
import { KeysetCursor, ServerFeedResponse } from "@/definitions/api";
import { EventPost } from "@/definitions/posts";

export interface EventFeedQueryArgs {
  userId?: string; // The user's firebase auth id
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
          if (data && hasMore) {
            const { postId, timestamp } = data[data.length - 1];
            return { lastId: postId, lastTimestamp: timestamp };
          }
        },
      },
      query: ({ queryArg, pageParam }) => {
        let url = `feeds/events?userId=${queryArg.userId}`;

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
    getEvent: builder.query<
      EventPost,
      Pick<EventPost, "postId"> & EventFeedQueryArgs
    >({
      query: ({ postId, userId }) => `posts/event/${postId}?userId=${userId}`,
      providesTags: (result, error, queryArg) => [
        { type: "Event", id: queryArg.postId },
      ],
    }),
    createEvent: builder.mutation<
      Pick<EventPost, "postId">,
      Pick<EventPost, "title" | "body"> &
        Partial<Pick<EventPost, "images" | "youtubeId">>
    >({
      query: (newPostData) => ({
        url: "posts/event",
        method: "POST",
        body: newPostData,
      }),
      invalidatesTags: ["Events"],
    }),
    updateEvent: builder.mutation<
      void,
      Partial<Pick<EventPost, "title" | "body" | "images" | "youtubeId">> &
        Pick<EventPost, "postId">
    >({
      query: ({ postId, title, body, images }) => ({
        url: `/posts/event/${postId}`,
        method: "PATCH",
        body: { postId, title, body, images },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetEventsFeedInfiniteQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} = eventsApi;
