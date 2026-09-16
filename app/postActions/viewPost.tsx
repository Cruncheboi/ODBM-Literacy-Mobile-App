import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import CustomBackButton from "@/components/customBackButton";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import CommentCard from "@/components/commentCard";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useColorScheme } from "nativewind";
import { CommentSearchParams } from "@/app/postActions/createComment";
import ScrollToButton from "@/components/scrollToButton";
import useListScrollController from "@/hooks/useListScrollController";
import KebabIcon from "@/components/kebabIcon";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CustomBackground from "@/components/customBackground";
import ContentOptionsBottomSheetView from "@/components/contentOptionsBottomSheetView";
import {
  CommentFeedQueryArgs,
  useGetCommentsFeedInfiniteQuery,
} from "@/redux/query_services/injectedEndpoints.ts/comments";
import {
  TestimonyFeedQueryArgs,
  useGetTestimonyQuery,
} from "@/redux/query_services/injectedEndpoints.ts/testimonies";
import { useGetEventQuery } from "@/redux/query_services/injectedEndpoints.ts/events";
import ErrorText from "@/components/errorText";
import { QUERY_LIMIT } from "@/firebase_functions/firebaseFunctions";
import { Post, PostType, TestimonyPost } from "@/definitions/posts";
import StyledPostHeading, {
  StyledPostBody,
  StyledPostTitle,
} from "@/components/posts/styledPostContent";
import TestimonyPostDisplay from "@/components/posts/testimonyPost";
import EventPostDisplay from "@/components/posts/eventPost";
import { Content } from "@/definitions/api";
import { CommentPost } from "@/definitions/comments";
import { auth } from "@/firebaseConfig";
import { skipToken } from "@reduxjs/toolkit/query";
import { databaseApi } from "@/redux/query_services/databaseApi";

export type ViewPostSearchParams = {
  postId: string;
  postType: PostType;
};

const ViewPost = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();

  // POST DATA
  const { postId, postType } = useLocalSearchParams<ViewPostSearchParams>();
  const postQuery = useGetPostQuery(postType, postId);
  const post = postQuery.data;

  // COMMENT DATA
  // const commentsArg = auth.currentUser?.uid
  //   ? ({
  //       postId,
  //       userId: auth.currentUser.uid,
  //     } satisfies CommentFeedQueryArgs)
  //   : skipToken;
  // const arg = validArgOrSkip<CommentFeedQueryArgs>(auth.currentUser?.uid, {postId, userId: auth.currentUser!.uid})

  const commentsQuery = useGetCommentsFeedInfiniteQuery({
    postId,
    userId: auth.currentUser?.uid,
  });
  const comments: CommentPost[] =
    commentsQuery.data?.pages.flatMap((data) => data.data) ?? [];

  // FLASHLIST STATE
  const flashListRef = useRef<FlashList<CommentPost> | null>(null);
  const { onScrollToPressed, onScroll, showScrollToButton } =
    useListScrollController(flashListRef);

  // BOTTOM SHEET REFS
  const bottomSheetRef = useRef<BottomSheet>(null);
  const sheetIndexRef = useRef<number>(-1);
  const [bottomSheetContent, setBottomSheetContent] = useState<
    Content | null | undefined
  >(post);

  // BOTTOM SHEET CALLBACKS
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

  const onMoreOptionsPress = useCallback((post?: Content | null) => {
    setBottomSheetContent(post);
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

  // POST CALLBACKS
  const onEndReached = async () => {
    console.log("last doc reached.");
    if (comments.length < QUERY_LIMIT || commentsQuery.isFetching) return;
    commentsQuery.fetchNextPage();
  };

  const onRefresh = async () => {
    if (postType === "testimony") {
      dispatch(
        databaseApi.util.invalidateTags([
          { type: "TestimonyComments", id: postId },
        ]),
      );
    } else {
      dispatch(
        databaseApi.util.invalidateTags([
          { type: "EventComments", id: postId },
        ]),
      );
    }
  };

  const onAddCommentPressed = () => {
    router.push({
      pathname: "/postActions/createComment",
      params: {
        postId,
        postType,
      } as CommentSearchParams,
    });
  };

  // Header component
  const renderPostSection = () => {
    if (!post) {
      if (!postQuery.isFetching) {
        console.log(postQuery.error, postId, postType);
        return (
          <ErrorText>
            There was an error while trying to get data for this post.
          </ErrorText>
        );
      } else {
        return;
      }
    }
    const postComponent =
      post.postType === "testimony" ? (
        <TestimonyPostDisplay post={post} />
      ) : (
        <EventPostDisplay post={post} />
      );
    return (
      <>
        {postComponent}
        <CustomSectionSeparator />
        <View className="mb-3 flex flex-row items-center">
          <View className="flex-1">
            <Text className="text-xl font-semibold text-odbm-blue-600 dark:text-gray-200">
              Comments
            </Text>
          </View>
          {/* Button to add a post */}
          <TouchableOpacity className="p-2" onPress={onAddCommentPressed}>
            <FontAwesome6
              name="plus"
              size={24}
              color={colorScheme == "light" ? "#173A64" : "white"}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const ListEmptyComponent = useCallback(() => {
    if (commentsQuery.isFetching) {
      return null;
    }
    return (
      <View className="w-full">
        <Text className="text-odbm-blue-500 dark:text-gray-400">
          No comments yet.
        </Text>
      </View>
    );
  }, [commentsQuery.isFetching]);

  const renderComment = useCallback(
    ({ item }: ListRenderItemInfo<CommentPost>) => {
      return (
        <TouchableOpacity
          className="flex"
          onPress={() => onMoreOptionsPress(item)}
        >
          <CommentCard comment={item} />
        </TouchableOpacity>
      );
    },
    [comments],
  );

  const itemSeparatorComponent = useCallback(() => {
    return <View className="p-2" />;
  }, []);

  return (
    <View className="py-safe-offset-3 flex flex-1 bg-primary px-4">
      {/* Header */}
      <View className="flex h-14 flex-row items-center justify-between">
        <CustomBackButton />
        <KebabIcon className="p-2" onPress={() => onMoreOptionsPress(post)} />
      </View>
      <FlashList
        stickyHeaderHiddenOnScroll={true}
        ListHeaderComponent={renderPostSection}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListEmptyComponent={ListEmptyComponent}
        data={comments}
        renderItem={renderComment}
        refreshing={commentsQuery.isFetching}
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
        {bottomSheetContent ? (
          <ContentOptionsBottomSheetView
            content={bottomSheetContent}
            contentType={postType}
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
export default ViewPost;

const useGetPostQuery = (postType: PostType, postId: string) => {
  console.log(postType, postId);
  if (postType === "testimony") {
    return useGetTestimonyQuery({ postId, userId: auth.currentUser?.uid });
  }
  return useGetEventQuery({ postId, userId: auth.currentUser?.uid });
};

// const validArgOrSkip = <T,>(condition: any, arg: T) => {
//   return condition ? arg : skipToken;
// };

// const getUserId = () => auth.currentUser?.uid;

// const
