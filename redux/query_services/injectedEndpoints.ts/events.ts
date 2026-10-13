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
    createEvent: builder.mutation<
      Pick<EventPost, "postId">,
      Pick<EventPost, "title" | "body"> &
        Partial<Pick<EventPost, "images"> & { youtubeUrl: string }>
    >({
      query: (newPostData) => ({
        url: "posts/event",
        method: "POST",
        body: newPostData,
      }),
      invalidatesTags: ["Events"],
      transformResponse: (res: any) => {
        return keysToCamel(res) as Pick<EventPost, "postId">;
      },
    }),
    updateEvent: builder.mutation<
      void,
      Pick<EventPost, "postId"> &
        Partial<Pick<EventPost, "title" | "body">> &
        ImageUpdate & {
          youtubeUrl?: string;
        }
    >({
      query: ({
        postId,
        title,
        body,
        imagesToDelete,
        imagesToInsert,
        youtubeUrl,
      }) => ({
        url: `/posts/event/${postId}`,
        method: "PUT",
        body: { title, body, imagesToDelete, imagesToInsert, youtubeUrl },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.postId },
      ],
    }),
    deleteEvent: builder.mutation<void, Pick<EventPost, "postId">>({
      query: ({ postId }) => ({
        url: `/posts/event/${postId}/delete`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.postId },
      ],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetEventsFeedInfiniteQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;
