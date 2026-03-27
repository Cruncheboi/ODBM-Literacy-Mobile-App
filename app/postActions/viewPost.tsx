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
import { Comment, Content, ContentType, PostType } from "@/firebaseConfig";
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
import { useGetCommentsInfiniteQuery } from "@/redux/services/injectedEndpoints.ts/comments";
import { firestoreApi } from "@/redux/services/firestore";
import { useGetTestimonyQuery } from "@/redux/services/injectedEndpoints.ts/testimonies";
import { useGetEventQuery } from "@/redux/services/injectedEndpoints.ts/events";
import ErrorText from "@/components/errorText";
import { QUERY_LIMIT } from "@/firebase_functions/firebaseFunctions";

export type ViewPostSearchParams = {
  postID: string;
  postType: PostType;
};

const ViewPost = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();

  // Post data
  const { postID, postType } = useLocalSearchParams<ViewPostSearchParams>();
  const postQuery = useGetPostQuery(postType, postID);
  const post = postQuery.data;

  // Comment data
  const commentsQuery = useGetCommentsInfiniteQuery({
    fieldValues: { documentId: postID },
    postType,
  });
  const comments: Comment[] =
    commentsQuery.data?.pages.flatMap((data) => data) ?? [];

  // Flashlist state
  const flashListRef = useRef<FlashList<Comment> | null>(null);
  const { onScrollToPressed, onScroll, showScrollToButton } =
    useListScrollController(flashListRef);

  // Bottom Sheet refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const sheetIndexRef = useRef<number>(-1);
  const [bottomSheetContent, setBottomSheetContent] = useState<
    Content | null | undefined
  >(post);

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

  // Post Callbacks
  const onEndReached = async () => {
    console.log("last doc reached.");
    if (comments.length < QUERY_LIMIT || commentsQuery.isFetching) return;
    commentsQuery.fetchNextPage();
  };

  const onRefresh = async () => {
    if (postType === "testimony") {
      dispatch(
        firestoreApi.util.invalidateTags([
          { type: "TestimonyComments", id: postID },
        ]),
      );
    } else {
      dispatch(
        firestoreApi.util.invalidateTags([
          { type: "EventComments", id: postID },
        ]),
      );
    }
  };

  const onAddPost = () => {
    router.push({
      pathname: "/postActions/createComment",
      params: {
        postID,
        postType,
      } as CommentSearchParams,
    });
  };

  const postSection = () => {
    if (!post) {
      if (!postQuery.isFetching) {
        return (
          <ErrorText>
            There was an error while trying to get data for this post.
          </ErrorText>
        );
      } else {
        return;
      }
    }

    const { date, displayName, title, body } = post;
    const postDate = new Date(date);
    return (
      <>
        <View className="flex">
          <View className="flex-1">
            <Text className="text-odbm-gold">@{displayName}</Text>
          </View>
          <Text className="dark:text-gray-300 text-odbm-blue-600">
            {postDate.toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <Text className="dark:text-gray-200 text-xl font-bold mt-4">
          {title}
        </Text>
        <Text className="dark:text-gray-300 text-lg mb-4 mt-2">{body}</Text>
        <CustomSectionSeparator />
        <View className="mb-3 flex flex-row items-center">
          <View className="flex-1">
            <Text className="dark:text-gray-200 text-xl font-semibold">
              Comments
            </Text>
          </View>
          {/* Button to add a post */}
          <TouchableOpacity className="p-2" onPress={onAddPost}>
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
        <Text className="dark:text-gray-400">No comments yet.</Text>
      </View>
    );
  }, [commentsQuery.isFetching]);

  const renderComment = useCallback(
    ({ item }: ListRenderItemInfo<Comment>) => {
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
    <View className="py-safe-offset-3 dark:bg-odbm-gray-digital flex flex-1 px-4">
      {/* Header */}
      <View className="h-14 flex flex-row items-center justify-between">
        <CustomBackButton />
        <KebabIcon className="p-2" onPress={() => onMoreOptionsPress(post)} />
      </View>
      <FlashList
        stickyHeaderHiddenOnScroll={true}
        ListHeaderComponent={postSection}
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
          <ContentOptionsBottomSheetView content={bottomSheetContent} />
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
  if (postType === "testimony") {
    return useGetTestimonyQuery({ documentId: postId });
  }
  return useGetEventQuery({ documentId: postId });
};
