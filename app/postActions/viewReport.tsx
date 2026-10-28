import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import CustomBackButton from "@/components/customBackButton";
import React, { useCallback, useRef } from "react";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import ScrollToButton from "@/components/scrollToButton";
import useListScrollController from "@/hooks/useListScrollController";
import ReportCard from "@/components/reportCard";
import ReportedContentSection from "@/components/reportedContentSection";
import KebabIcon from "@/components/kebabIcon";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CustomBackground from "@/components/customBackground";
import ContentOptionsBottomSheetView from "@/components/contentOptionsBottomSheetView";
import {
  useGetAdminSingleCommentQuery,
  useGetAdminSingleEventQuery,
  useGetAdminSingleTestimonyQuery,
  useGetReportsFromContentFeedInfiniteQuery,
} from "@/redux/query_services/injectedEndpoints.ts/moderation";
import { ReportHistoryItem } from "@/definitions/moderation";
import { ContentType } from "@/definitions/api";

export type ViewReportSearchParams = {
  postId: string;
  commentId: string;
  contentType: ContentType;
};

const ViewReport = () => {
  const navigation = useNavigation();
  const { postId, commentId, contentType } =
    useLocalSearchParams<ViewReportSearchParams>();

  // Reported Post data
  const numericPostId = parseInt(postId, 10);
  const numericCommentId = parseInt(commentId, 10);
  const reportedPost = useGetReportedPostData(
    contentType,
    numericPostId,
    numericCommentId,
  );

  // Report data
  const { data, isFetching, fetchNextPage, refetch } =
    useGetReportsFromContentFeedInfiniteQuery({
      commentId: numericCommentId,
      postId: numericPostId,
    });

  const reports: ReportHistoryItem[] =
    data?.pages.flatMap((data) => data.data) ?? [];
  const hasMore = data?.pages[data?.pages.length - 1].hasMore;

  // Flashlist state
  const flashListRef = useRef<FlashList<ReportHistoryItem> | null>(null);
  const { onScrollToPressed, onScroll, showScrollToButton } =
    useListScrollController(flashListRef);

  // Bottom Sheet refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const sheetIndexRef = useRef<number>(-1);

  // Bottom sheet callbacks
  useFocusEffect(
    useCallback(() => {
      // Close the bottom sheet when screen loses focus
      const unsubscribe = navigation.addListener("blur", () => {
        bottomSheetRef.current?.close();
      });

      return unsubscribe;
    }, [navigation, bottomSheetRef]),
  );

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
    sheetIndexRef.current = index;
  }, []);

  const onKebabPress = useCallback(() => {
    if (sheetIndexRef.current < 0) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  // FlashList callbacks
  const onEndReached = async () => {
    console.log("last doc reached.");
    if (!hasMore || isFetching) return;
    fetchNextPage();
  };

  const onRefresh = async () => {
    reportedPost.refetch();
    refetch();
  };

  const ListEmptyComponent = useCallback(() => {
    if (isFetching) {
      return null;
    }
    return (
      <View className="w-full">
        <Text className="text-odbm-blue-500 dark:text-gray-400">
          No reports yet.
        </Text>
      </View>
    );
  }, [isFetching]);

  const renderItem = ({ item }: ListRenderItemInfo<ReportHistoryItem>) => {
    return <ReportCard report={item} />;
  };

  const itemSeparatorComponent = () => {
    return <View className="p-2" />;
  };

  return (
    <View className="py-safe-offset-3 flex flex-1 bg-primary px-4">
      {/* Header */}
      <View className="flex h-14 flex-row items-center justify-between">
        <CustomBackButton />
        <KebabIcon className="p-2" onPress={onKebabPress} />
      </View>
      <FlashList
        stickyHeaderHiddenOnScroll={true}
        ListHeaderComponent={() => (
          <ReportedContentSection content={reportedPost.data} />
        )}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListEmptyComponent={ListEmptyComponent}
        data={reports}
        renderItem={renderItem}
        refreshing={isFetching}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        estimatedItemSize={68}
        ref={flashListRef}
        onScroll={onScroll}
      />
      <View className="relative flex">
        <ScrollToButton
          onPress={onScrollToPressed}
          isHidden={!showScrollToButton}
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={sheetIndexRef.current}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundComponent={CustomBackground}
      >
        {reportedPost.data ? (
          <ContentOptionsBottomSheetView
            content={reportedPost.data}
            contentType={reportedPost.data.postType}
          />
        ) : (
          <BottomSheetView className="flex items-center justify-center">
            <ActivityIndicator />
          </BottomSheetView>
        )}
      </BottomSheet>
    </View>
  );
};

// Helper function to get the needed RTK Query hook
const useGetReportedPostData = (
  contentType: ContentType,
  postId: number,
  commentId: number,
) => {
  if (contentType === "testimony") {
    return useGetAdminSingleTestimonyQuery({ postId });
  } else if (contentType === "event") {
    return useGetAdminSingleEventQuery({ postId });
  } else {
    return useGetAdminSingleCommentQuery({ commentId });
  }
};

export default ViewReport;
