import { Comment } from "@/firebaseConfig";
import useListScrollController from "@/hooks/useListScrollController";
import { useAppDispatch } from "@/redux/hooks";
import { firestoreApi } from "@/redux/services/firestore";
import { useGetReportedCommentsInfiniteQuery } from "@/redux/services/injectedEndpoints.ts/reports";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useCallback, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PostCard from "./postCard";
import CustomSectionSeparator from "./customSectionSeparator";
import ScrollToButton from "./scrollToButton";
import CommentCard from "./commentCard";
import { router } from "expo-router";
import { ViewReportSearchParams } from "@/app/postActions/viewReport";
import { QUERY_LIMIT } from "@/firebase_functions/firebaseFunctions";
const CommentReportList = () => {
  const dispatch = useAppDispatch();

  const { data, isFetching, fetchNextPage } =
    useGetReportedCommentsInfiniteQuery();

  const comments: Comment[] = data?.pages.flatMap((data) => data) ?? [];

  // FlashList state
  const flashListRef = useRef<FlashList<Comment> | null>(null);
  const { showScrollToButton, onScrollToPressed, onScroll } =
    useListScrollController(flashListRef);

  const renderListItem = ({ item }: ListRenderItemInfo<Comment>) => {
    return (
      <TouchableOpacity
        className="flex w-full px-6 py-2"
        onPress={() => onCommentPressed(item.documentId)}
      >
        <CommentCard comment={item} />
      </TouchableOpacity>
    );
  };

  const onCommentPressed = (postId: string) => {
    router.push({
      pathname: "/postActions/viewReport",
      params: { contentType: "comment", postId } as ViewReportSearchParams,
    });
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
      firestoreApi.util.invalidateTags([{ type: "Reported", id: "comment" }]),
    );
  };

  const onEndReached = async () => {
    console.log("end reached.");
    if (isFetching || comments.length < QUERY_LIMIT) return;
    console.log("fetching new data.");
    fetchNextPage();
  };

  return (
    <View className="relative flex-1 bg-primary">
      <FlashList
        contentContainerClassName="w-full flex py-3"
        className="w-full bg-primary"
        data={comments}
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
export default CommentReportList;
