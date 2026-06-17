import { Testimony } from "@/firebaseConfig";
import useListScrollController from "@/hooks/useListScrollController";
import { useAppDispatch } from "@/redux/hooks";
import { firestoreApi } from "@/redux/services/firestore";
import { useGetReportedTestimoniesInfiniteQuery } from "@/redux/services/injectedEndpoints.ts/reports";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useCallback, useRef } from "react";
import { View, Text } from "react-native";
import PostCard from "./postCard";
import CustomSectionSeparator from "./customSectionSeparator";
import ScrollToButton from "./scrollToButton";
import { QUERY_LIMIT } from "@/firebase_functions/firebaseFunctions";
const TestimonyReportList = () => {
  const dispatch = useAppDispatch();

  const { data, isFetching, fetchNextPage } =
    useGetReportedTestimoniesInfiniteQuery();

  const testimonies: Testimony[] = data?.pages.flatMap((data) => data) ?? [];

  // FlashList state
  const flashListRef = useRef<FlashList<Testimony> | null>(null);
  const { showScrollToButton, onScrollToPressed, onScroll } =
    useListScrollController(flashListRef);

  const renderListItem = ({ item }: ListRenderItemInfo<Testimony>) => {
    return <PostCard post={item} isReported={true} />;
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
    dispatch(
      firestoreApi.util.invalidateTags([{ type: "Reported", id: "testimony" }]),
    );
  };

  const onEndReached = async () => {
    console.log("end reached.");
    if (isFetching || testimonies.length < QUERY_LIMIT) return;
    console.log("fetching new data.");
    fetchNextPage();
  };

  return (
    <View className="relative flex-1 bg-primary">
      <FlashList
        contentContainerClassName="w-full flex py-3"
        className="w-full bg-primary"
        data={testimonies}
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
export default TestimonyReportList;
