import { CommentPost } from "@/definitions/comments";
import { databaseApi } from "../databaseApi";
import { KeysetCursor, ServerFeedResponse } from "@/definitions/api";
import {
  Filter,
  GroupedModerationItem,
  ReportHistoryItem,
  ReportReason,
  SortType,
  ReportStatus,
  UserReport,
  AdminCommentPost,
} from "@/definitions/moderation";
import { EventPost, TestimonyPost } from "@/definitions/posts";
import keysToCamel from "@/utility_functions/keysToCamel";

export interface ReportedContentFeedQueryArgs {
  status?: ReportStatus;
  filterType?: Filter;
  sortBy?: SortType;
}

interface ReportsFromContentFeedQueryArgs {
  postId?: number;
  commentId?: number;
  reasonFilter?: ReportReason;
}

const moderationApi = databaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportedContentFeed: builder.infiniteQuery<
      ServerFeedResponse<GroupedModerationItem>,
      ReportedContentFeedQueryArgs,
      (KeysetCursor & { lastCount: string }) | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          const { data, hasMore } = lastPage;
          if (data && data.length === 0 && hasMore) {
            const { latestId, latestTimestamp, reportCount } =
              data[data.length - 1];
            return {
              lastId: latestId,
              lastTimestamp: latestTimestamp,
              lastCount: reportCount,
            };
          }
        },
      },
      query: ({ queryArg, pageParam }) => {
        const { status, filterType, sortBy } = queryArg;
        const targetStatus = status || "pending";
        const targetFilter = filterType || "all";
        const targetSort = sortBy || "recency";
        let url = `moderation/grouped-feed?status=${targetStatus}&filterType=${targetFilter}&sortBy=${targetSort}`;

        if (pageParam) {
          const { lastId, lastTimestamp, lastCount } = pageParam;
          url += `&lastId=${lastId}`;

          if (sortBy === "count") {
            url += `&lastCount=${lastCount}`;
          } else {
            url += `&lastTimestamp=${encodeURIComponent(lastTimestamp)}`;
          }
        }

        return url;
      },
      providesTags: [{ type: "Reported", id: "LIST" }],
      transformResponse: (res: ServerFeedResponse<GroupedModerationItem>) => {
        const { hasMore, data } = res;
        const camelCasedData = keysToCamel(data) as GroupedModerationItem[];

        return {
          hasMore,
          data: camelCasedData,
        };
      },
    }),
    getReportsFromContentFeed: builder.infiniteQuery<
      ServerFeedResponse<ReportHistoryItem>,
      ReportsFromContentFeedQueryArgs,
      KeysetCursor | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          const { data, hasMore } = lastPage;
          if (data && data.length === 0 && hasMore) {
            const { reportId, timestamp } = data[data.length - 1];
            return {
              lastId: reportId,
              lastTimestamp: timestamp,
            };
          }
        },
      },
      query: ({ queryArg, pageParam }) => {
        const { reasonFilter, postId, commentId } = queryArg;
        const targetReason = reasonFilter || "all";
        let url = `moderation/report-history?reasonFilter=${targetReason}`;
        if (postId) {
          url += `&postId=${postId}`;
        }
        if (commentId) {
          url += `&commentId=${commentId}`;
        }

        if (pageParam) {
          const { lastId, lastTimestamp } = pageParam;
          url += `&lastId=${lastId}&lastTimestamp=${encodeURIComponent(lastTimestamp)}`;
        }

        return url;
      },
      providesTags: [{ type: "Report", id: "LIST" }],
      transformResponse: (res: ServerFeedResponse<ReportHistoryItem>) => {
        const { hasMore, data } = res;
        const camelCasedData = keysToCamel(data) as ReportHistoryItem[];

        return {
          hasMore,
          data: camelCasedData,
        };
      },
    }),
    createReport: builder.mutation<
      Pick<UserReport, "reportId">,
      Pick<UserReport, "reason" | "details" | "commentId" | "postId">
    >({
      query: (newReportData) => ({
        url: "moderation/reports",
        method: "POST",
        body: newReportData,
      }),
    }),
    getAdminSingleTestimony: builder.query<
      TestimonyPost,
      Pick<TestimonyPost, "postId">
    >({
      query: ({ postId }) => `moderation/posts/testimony/${postId}`,
      providesTags: (result, error, queryArg) => [
        { type: "ReportedPost", id: queryArg.postId },
      ],
      transformResponse: (res: TestimonyPost) => {
        const camelCasedData = keysToCamel(res) as TestimonyPost;
        camelCasedData.postType = "testimony";
        return camelCasedData;
      },
    }),
    getAdminSingleEvent: builder.query<EventPost, Pick<EventPost, "postId">>({
      query: ({ postId }) => `moderation/posts/event/${postId}`,
      providesTags: (result, error, queryArg) => [
        { type: "ReportedPost", id: queryArg.postId },
      ],
      transformResponse: (res: EventPost) => {
        const camelCasedData = keysToCamel(res) as EventPost;
        camelCasedData.postType = "event";
        return camelCasedData;
      },
    }),
    getAdminSingleComment: builder.query<
      AdminCommentPost,
      Pick<AdminCommentPost, "commentId">
    >({
      query: ({ commentId }) => `moderation/comments/${commentId}`,
      providesTags: (result, error, queryArg) => [
        { type: "ReportedComment", id: queryArg.commentId },
      ],
      transformResponse: (res: AdminCommentPost) => {
        const camelCasedData = keysToCamel(res) as AdminCommentPost;
        camelCasedData.postType = "comment";
        return camelCasedData;
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetReportedContentFeedInfiniteQuery,
  useGetReportsFromContentFeedInfiniteQuery,
  useCreateReportMutation,
  useGetAdminSingleCommentQuery,
  useGetAdminSingleEventQuery,
  useGetAdminSingleTestimonyQuery,
} = moderationApi;
