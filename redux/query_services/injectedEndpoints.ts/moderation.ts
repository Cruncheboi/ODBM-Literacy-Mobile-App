import { databaseApi } from "../databaseApi";
import { KeysetCursor, ServerFeedResponse } from "@/definitions/api";
import {
  Filter,
  GroupedModerationItem,
  ReportHistoryItem,
  ReportReason,
  SortType,
  ReportStatus,
} from "@/definitions/moderation";
import keysToCamel from "@/utility_functions/keysToCamel";

interface ReportedContentFeedQueryArgs {
  status?: ReportStatus;
  filterType?: Filter;
  sortBy?: SortType;
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
          if (data && hasMore) {
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
        let url = `moderation/grouped-feed?status=${status}&filterType=${filterType}&sortBy=${sortBy}`;

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
      providesTags: ["Reported"],
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
      { reasonFilter: ReportReason },
      KeysetCursor | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          const { data, hasMore } = lastPage;
          if (data && hasMore) {
            const { reportId, timestamp } = data[data.length - 1];
            return {
              lastId: reportId,
              lastTimestamp: timestamp,
            };
          }
        },
      },
      query: ({ queryArg, pageParam }) => {
        const { reasonFilter } = queryArg;
        let url = `moderation/report-history?reasonFilter=${reasonFilter}`;

        if (pageParam) {
          const { lastId, lastTimestamp } = pageParam;
          url += `&lastId=${lastId}&lastTimestamp=${encodeURIComponent(lastTimestamp)}`;
        }

        return url;
      },
      providesTags: ["Report"],
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
      Pick<ReportHistoryItem, "reportId">,
      Pick<ReportHistoryItem, "reason" | "details">
    >({
      query: (newReportData) => ({
        url: "moderation/reports",
        method: "POST",
        body: newReportData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetReportedContentFeedInfiniteQuery,
  useGetReportsFromContentFeedInfiniteQuery,
  useCreateReportMutation,
} = moderationApi;
