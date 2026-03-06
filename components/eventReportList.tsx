import { Event, Testimony } from "@/firebaseConfig";
import useListScrollController from "@/hooks/useListScrollController";
import { useAppDispatch } from "@/redux/hooks";
import { firestoreApi } from "@/redux/services/firestore";
import {
  useGetReportedEventsInfiniteQuery,
  useGetReportedTestimoniesInfiniteQuery,
} from "@/redux/services/injectedEndpoints.ts/reports";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useCallback, useRef } from "react";
import { View, Text } from "react-native";
import PostCard from "./postCard";
import CustomSectionSeparator from "./customSectionSeparator";
import ScrollToButton from "./scrollToButton";
const EventReportList = () => {
  const dispatch = useAppDispatch();

  const { data, isFetching, fetchNextPage } =
    useGetReportedEventsInfiniteQuery();

  const events: Event[] = data?.pages.flatMap((data) => data) ?? [];

  // FlashList state
  const flashListRef = useRef<FlashList<Event> | null>(null);
  const { showScrollToButton, onScrollToPressed, onScroll } =
    useListScrollController(flashListRef);

  const renderListItem = ({ item }: ListRenderItemInfo<Event>) => {
    return <PostCard post={item} />;
  };

  const itemSeparatorComponent = () => <CustomSectionSeparator />;

  // Retrieves component to display when there are no posts to show
  const showItemOnEmptyList = useCallback(() => {
    return (
      <View>
        <Text className="text-center dark:text-gray-300 text-xl">
          Hmm... Looks like there are no items yet.
        </Text>
      </View>
    );
  }, []);

  // Retrieves component to display when there was an error retrieving posts
  const showItemOnError = useCallback(() => {
    return (
      <View>
        <Text className="text-center dark:text-gray-300 text-xl">
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
    dispatch(
      firestoreApi.util.invalidateTags([{ type: "Reported", id: "event" }]),
    );
  };

  const onEndReached = async () => {
    console.log("end reached.");
    if (isFetching || events.length == 0) return;
    console.log("fetching new data.");
    fetchNextPage();
  };

  return (
    <View className="flex-1 dark:bg-odbm-gray-digital relative">
      <FlashList
        contentContainerClassName="w-full flex py-3"
        className="w-full dark:bg-odbm-gray-digital"
        data={events}
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
export default EventReportList;
