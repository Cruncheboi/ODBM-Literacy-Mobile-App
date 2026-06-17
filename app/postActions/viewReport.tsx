import { useAppDispatch } from "@/redux/hooks";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import CustomBackButton from "@/components/customBackButton";
import React, { useCallback, useRef } from "react";
import { ContentType, Report } from "@/firebaseConfig";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import ScrollToButton from "@/components/scrollToButton";
import useListScrollController from "@/hooks/useListScrollController";
import { useGetReportsFromUserContentInfiniteQuery } from "@/redux/services/injectedEndpoints.ts/reports";
import { firestoreApi } from "@/redux/services/firestore";
import ReportCard from "@/components/reportCard";
import { useGetTestimonyQuery } from "@/redux/services/injectedEndpoints.ts/testimonies";
import ReportedContentSection from "@/components/reportedContentSection";
import { useGetEventQuery } from "@/redux/services/injectedEndpoints.ts/events";
import { useGetCommentQuery } from "@/redux/services/injectedEndpoints.ts/comments";
import KebabIcon from "@/components/kebabIcon";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CustomBackground from "@/components/customBackground";
import ContentOptionsBottomSheetView from "@/components/contentOptionsBottomSheetView";
import { QUERY_LIMIT } from "@/firebase_functions/firebaseFunctions";

export type ViewReportSearchParams = {
  postId: string;
  contentType: ContentType;
};

const ViewReport = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { postId, contentType } =
    useLocalSearchParams<ViewReportSearchParams>();

  // Reported Post data
  const reportedPost = useGetReportedPostData(contentType, postId);

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
    if (reports.length < QUERY_LIMIT || isFetching) return;
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

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Report>) => {
    return <ReportCard report={item} />;
  }, []);

  const itemSeparatorComponent = useCallback(() => {
    return <View className="p-2" />;
  }, []);

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
          <ContentOptionsBottomSheetView content={reportedPost.data} />
        ) : (
          <BottomSheetView className="flex items-center justify-center">
            <ActivityIndicator />
          </BottomSheetView>
        )}
      </BottomSheet>
    </View>
  );
};
export default ViewReport;

// Helper function to get the RTK Query hook in use
const useGetReportedPostData = (
  contentType: ContentType,
  documentId: string,
) => {
  if (contentType === "testimony") {
    return useGetTestimonyQuery({ documentId: documentId });
  } else if (contentType === "event") {
    return useGetEventQuery({ documentId: documentId });
  } else {
    return useGetCommentQuery({ documentId: documentId });
  }
};
