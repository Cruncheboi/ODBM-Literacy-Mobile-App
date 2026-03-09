import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import CustomBackButton from "@/components/customBackButton";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import CommentCard from "@/components/commentCard";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Comment,
  Content,
  ContentType,
  Event,
  Report,
  Testimony,
} from "@/firebaseConfig";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useColorScheme } from "nativewind";
import ScrollToButton from "@/components/scrollToButton";
import useListScrollController from "@/hooks/useListScrollController";
import { useGetReportsFromUserContentInfiniteQuery } from "@/redux/services/injectedEndpoints.ts/reports";
import { firestoreApi } from "@/redux/services/firestore";
import ReportCard from "@/components/reportCard";
import { useGetTestimonyQuery } from "@/redux/services/injectedEndpoints.ts/testimonies";
import ReportedContentSection from "@/components/reportedContentSection";
import { useGetEventQuery } from "@/redux/services/injectedEndpoints.ts/events";
import { useGetCommentQuery } from "@/redux/services/injectedEndpoints.ts/comments";

export type ViewReportSearchParams = {
  postId: string;
  contentType: ContentType;
};

const ViewReport = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();
  const { postId, contentType } =
    useLocalSearchParams<ViewReportSearchParams>();

  // Reported Post data
  const reportedPost = getReportedPostData(contentType, postId);

  // Report data
  const { data, isFetching, fetchNextPage } =
    useGetReportsFromUserContentInfiniteQuery({
      contentType: contentType,
      reportedPostId: postId,
    });
  const reports: Report[] = data?.pages.flatMap((data) => data) ?? [];

  // Flashlist state
  const flashListRef = useRef<FlashList<Report> | null>(null);
  const { onScrollToPressed, onScroll, showScrollToButton } =
    useListScrollController(flashListRef);

  const onEndReached = async () => {
    console.log("last doc reached.");
    if (reports.length == 0 || isFetching) return;
    fetchNextPage();
  };

  const onRefresh = async () => {
    dispatch(
      firestoreApi.util.invalidateTags([
        { type: "Report", id: contentType satisfies ContentType },
      ]),
    );
  };

  const ListEmptyComponent = useCallback(() => {
    return (
      <View className="w-full">
        <Text className="dark:text-gray-400">No reports yet.</Text>
      </View>
    );
  }, []);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Report>) => {
    return <ReportCard report={item} />;
  }, []);

  const itemSeparatorComponent = useCallback(() => {
    return <View className="p-2" />;
  }, []);

  return (
    <View className="py-safe-offset-3 dark:bg-odbm-gray-digital flex flex-1 px-4">
      {/* Header */}
      <View className="h-10 flex flex-row">
        <CustomBackButton />
      </View>
      <FlashList
        // StickyHeaderComponent={StickyHeaderComponent}
        stickyHeaderHiddenOnScroll={true}
        // stickyHeaderIndices={[0]}
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
    </View>
  );
};
export default ViewReport;

// Helper function to get the RTK Query hook in use
const getReportedPostData = (contentType: ContentType, documentId: string) => {
  if (contentType === "testimony") {
    return useGetTestimonyQuery({ documentId: documentId });
  } else if (contentType === "event") {
    return useGetEventQuery({ documentId: documentId });
  } else {
    return useGetCommentQuery({ documentId: documentId });
  }
};
