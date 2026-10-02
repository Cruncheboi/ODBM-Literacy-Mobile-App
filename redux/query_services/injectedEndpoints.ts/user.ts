import { databaseApi } from "../databaseApi";
import { KeysetCursor, ServerFeedResponse } from "@/definitions/api";
import { BlockedUserRecord } from "@/definitions/moderation";
import keysToCamel from "@/utility_functions/keysToCamel";

const usersApi = databaseApi.injectEndpoints({
  endpoints: (builder) => ({
    blockUser: builder.mutation<
      { message: string },
      { blockedFirebaseAuthId: string }
    >({
      query: (bodyData) => ({
        url: "users/block",
        method: "POST",
        body: bodyData,
      }),
      invalidatesTags: ["Testimonies", "Events", "Comments"],
    }),
    unblockUser: builder.mutation<
      { message: string },
      { blockedFirebaseAuthId: string }
    >({
      query: (bodyData) => ({
        url: "users/unblock",
        method: "DELETE",
        body: bodyData,
      }),
      invalidatesTags: ["Testimonies", "Events", "Comments"],
    }),
    getBlockedUsersFeed: builder.infiniteQuery<
      ServerFeedResponse<BlockedUserRecord>,
      void,
      KeysetCursor | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          const { data, hasMore } = lastPage;

          if (!hasMore || !data || (data && data.length === 0))
            return undefined;

          // get info from last item of page
          const { blockedId, blockedAt } =
            lastPage.data[lastPage.data.length - 1];

          return {
            lastId: blockedId,
            lastTimestamp: blockedAt,
          };
        },
      },
      query: ({ pageParam }) => {
        let url = "users/blocks";
        if (pageParam) {
          const { lastTimestamp, lastId } = pageParam;
          url += `?lastTimestamp=${encodeURIComponent(lastTimestamp)}&lastId=${lastId}`;
        }
        return url;
      },
      providesTags: ["Blocks"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetBlockedUsersFeedInfiniteQuery,
} = usersApi;
