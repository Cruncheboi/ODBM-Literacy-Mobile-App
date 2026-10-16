import useListScrollController from "@/hooks/useListScrollController";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useCallback, useRef } from "react";
import { View, Text } from "react-native";
import CustomSectionSeparator from "../customSectionSeparator";
import ScrollToButton from "../scrollToButton";
import {
  ReportedContentFeedQueryArgs,
  useGetReportedContentFeedInfiniteQuery,
} from "@/redux/query_services/injectedEndpoints.ts/moderation";
import { GroupedModerationItem } from "@/definitions/moderation";
import ReportedContentCard from "./reportedContentCard";

const ReportedContentList = ({
  filterType,
  sortBy,
  status,
}: ReportedContentFeedQueryArgs) => {
  const { data, isFetching, fetchNextPage, refetch } =
    useGetReportedContentFeedInfiniteQuery({
      filterType,
      sortBy,
      status,
    });

  const reporteditems: GroupedModerationItem[] =
    data?.pages.flatMap((data) => data.data) ?? [];
  const hasMore = data?.pages[data?.pages.length - 1].hasMore ?? false;
  console.log(reporteditems);

  // FlashList state
  const flashListRef = useRef<FlashList<GroupedModerationItem> | null>(null);
  const { showScrollToButton, onScrollToPressed, onScroll } =
    useListScrollController(flashListRef);

  const renderListItem = ({
    item,
  }: ListRenderItemInfo<GroupedModerationItem>) => {
    return <ReportedContentCard reportedContent={item} />;
  };

  const itemSeparatorComponent = () => <CustomSectionSeparator />;

  // Retrieves component to display when there are no posts to show
  const showItemOnEmptyList = useCallback(() => {
    return (
      <View>
        <Text className="text-center text-xl dark:text-gray-300">
          Hmm... Looks like there are no items yet.
        </Text>
      </View>
    );
  }, []);

  // Retrieves component to display when there was an error retrieving posts
  const showItemOnError = useCallback(() => {
    return (
      <View>
        <Text className="text-center text-xl dark:text-gray-300">
          Hmm... Looks like an error occurred.
        </Text>
      </View>
    );
  }, []);

  // Returns the component to display on an empty list based on loading and post data state.
  const listEmptyComponent = () => {
    if (isFetching) {
      return null;
    }

    if (data == undefined) {
      return showItemOnError();
    }
    return showItemOnEmptyList();
  };

  const onListRefreshed = async () => {
    refetch();
  };

  const onEndReached = async () => {
    console.log("end reached.");
    if (isFetching || !hasMore) return;
    console.log("fetching new data.");
    fetchNextPage();
  };

  return (
    <View className="relative flex-1 bg-primary">
      <FlashList
        contentContainerClassName="w-full flex py-3"
        className="w-full bg-primary"
        data={reporteditems}
        renderItem={renderListItem}
        ListEmptyComponent={listEmptyComponent}
        ItemSeparatorComponent={itemSeparatorComponent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={isFetching}
        onRefresh={onListRefreshed}
        estimatedItemSize={230}
        ref={flashListRef}
        onScroll={onScroll}
      />
      <ScrollToButton
        onPress={onScrollToPressed}
        isHidden={!showScrollToButton}
      />
    </View>
  );
};
export default ReportedContentList;
