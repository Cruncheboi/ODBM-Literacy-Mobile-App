import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { PostType } from ".";
import CustomBackButton from "@/components/customBackButton";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import CommentCard from "@/components/commentCard";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Comment } from "@/firebaseConfig";
import {
  addComments,
  Comments,
  initializePostComments,
  resetCommentsOfAPost,
} from "@/redux/features/commentsSlice";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { DocumentSnapshot } from "firebase/firestore";
import {
  getComments,
  QUERY_LIMIT,
} from "@/firebase_functions/firebaseFunctions";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useColorScheme } from "nativewind";
import { CommentSearchParams } from "./createComment";

export type SearchParams = {
  postID: string;
  postType: PostType;
};

const ViewPost = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();

  // Post data
  const { postID, postType } = useLocalSearchParams<SearchParams>();

  const { displayName, body, title, date, documentID } = useAppSelector(
    (state) => {
      if (postType == "testimony") {
        return state.posts.testimonies[postID];
      }
      return state.posts.events[postID];
    }
  );

  const postDate = new Date(date);

  // Comment state
  const [isLoading, setIsLoading] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const lastCommentReachedRef = useRef(false);
  const lastCommentDocSnapshotRef = useRef<DocumentSnapshot | undefined>(
    undefined
  );
  const lastCommentDocID = useAppSelector(
    (state) => state.comments[postID]?.lastCommentDocID
  );
  const comments = useAppSelector(
    (state) => state.comments[postID]?.comments
  ) as Comments | undefined;

  const setInitialCommentState = async () => {
    if (comments != undefined) {
      console.log("setting initial state");
      console.log("attempting retrieval of initial state from store");
      console.log(comments);
      const loadedComments = Object.values(comments);
      console.log(loadedComments);
      if (loadedComments.length > 0) {
        console.log("using comments from existing state");
        setPostComments(loadedComments);
        return;
      }
    }
    setIsLoading(true);
    console.log("getting new initial comments");
    await getPostComments(lastCommentDocID);
    setIsLoading(false);
    console.log("finished setting initial state");
  };

  useEffect(() => {
    if (comments != undefined) {
      setPostComments((prev) => Object.values(comments));
    }
  }, [comments]);

  useEffect(() => {
    (async () => {
      console.log("Initializing post comments");
      if (comments == undefined) {
        dispatch(initializePostComments({ postID: postID }));
      }
      console.log("Setting comment state");
      await setInitialCommentState();
      console.log("Finished setting comment state");
    })();
  }, []);

  const resetCommentsState = () => {
    lastCommentReachedRef.current = false;
    lastCommentDocSnapshotRef.current = undefined;
    setPostComments((prev) => []);
  };

  const getPostComments = async (lastVisibleCommentDocID?: string) => {
    if (lastCommentReachedRef.current) return;
    console.log(lastVisibleCommentDocID);
    try {
      const [newComments, lastDoc] = await getComments(
        postType,
        documentID,
        lastCommentDocSnapshotRef.current,
        lastVisibleCommentDocID
      );
      if (newComments.length < QUERY_LIMIT) {
        lastCommentReachedRef.current = true;
      }
      lastCommentDocSnapshotRef.current = lastDoc;
      dispatch(
        addComments({ comments: newComments, lastCommentDocID: lastDoc?.id })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onEndReached = async () => {
    console.log("last doc reached.");
    if (
      lastCommentReachedRef.current ||
      lastCommentDocSnapshotRef.current == undefined ||
      postComments.length == 0 ||
      isLoading
    )
      return;
    setIsLoading(true);
    console.log(" loading more...");
    await getPostComments(lastCommentDocID);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    console.log("refreshing");
    setIsLoading(true);
    resetCommentsState();
    dispatch(resetCommentsOfAPost({ postID: postID }));
    await getPostComments();
    setIsLoading(false);
    console.log("finished refreshing");
  };

  const onAddPost = () => {
    router.push({
      pathname: "/(tabs)/posts/createComment",
      params: {
        postID: postID,
        postType: postType,
      } as CommentSearchParams,
    });
  };

  const postSection = () => {
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
        <View className="mb-2 flex flex-row">
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
    return (
      <View className="w-full">
        <Text className="dark:text-gray-400">No comments yet.</Text>
      </View>
    );
  }, []);

  const renderComment = useCallback(
    ({ item }: ListRenderItemInfo<Comment>) => {
      return <CommentCard comment={item} />;
    },
    [postComments]
  );

  const itemSeparatorComponent = useCallback(() => {
    return <View className="p-2" />;
  }, []);

  const StickyHeaderComponent = forwardRef(() => {
    return (
      <View className="h-10 flex flex-row px-4">
        <CustomBackButton />
        {/* <Text className="text-4xl tracking-wide font-bold text-odbm-blue-600 dark:text-white">
            {displayName}'s Post
            </Text> */}
      </View>
    );
  });

  return (
    <View className="py-safe-offset-3 dark:bg-odbm-gray-digital flex flex-1 px-4">
      {/* Header */}
      <View className="h-10 flex flex-row">
        <CustomBackButton />
        {/* <Text className="text-4xl tracking-wide font-bold text-odbm-blue-600 dark:text-white">
            {displayName}'s Post
            </Text> */}
      </View>
      <FlashList
        // StickyHeaderComponent={StickyHeaderComponent}
        stickyHeaderHiddenOnScroll={true}
        // stickyHeaderIndices={[0]}
        ListHeaderComponent={postSection}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListEmptyComponent={ListEmptyComponent}
        data={postComments}
        renderItem={renderComment}
        refreshing={isLoading}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        estimatedItemSize={68}
      />
    </View>
  );
};
export default ViewPost;
