import Card from "@/components/postCard";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { Event, Testimony } from "@/firebaseConfig";
import {
  getEvents,
  getTestimonies,
  QUERY_LIMIT,
} from "@/firebase_functions/firebaseFunctions";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useColorScheme } from "nativewind";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { useAppDispatch } from "@/redux/hooks";
import {
  addEventPosts,
  addTestimonyPosts,
  resetEventPosts,
  resetTestimonyPosts,
} from "@/redux/features/postsSlice";
import { resetAllComments } from "@/redux/features/commentsSlice";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";

export type PostType = "testimony" | "event";

const Index = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();

  // Testimony state
  const [testimonies, setTestimonies] = useState<Testimony[] | undefined>(
    undefined
  );
  const lastTestimonyDocReachedRef = useRef(false);
  const lastVisibleTestimonyDocRef = useRef<QueryDocumentSnapshot | undefined>(
    undefined
  );

  // Event state
  const [events, setEvents] = useState<Event[] | undefined>();
  const lastEventDocReachedRef = useRef(false);
  const lastVisibleEventDocRef = useRef<QueryDocumentSnapshot | undefined>(
    undefined
  );

  // Post state
  const [postType, setPostType] = useState<PostType>("testimony");
  const [isLoading, setIsLoading] = useState(false);
  const postSectionTitle = postType == "testimony" ? "Impact" : "Event";
  // Retrieves the post data that should currently be in use
  const postData = postType == "testimony" ? testimonies : events;

  // Top-Level filter for Impacts Page
  // const filter = forwardRef(() => {
  //   return (
  //     <View className="my-4 px-4 border-2 w-5/12 h-14 rounded-full border-odbm-blue-600 dark:border-slate-700 bg-odbm-gray flex">
  //       <View className="flex-1 flex-row bg-purple-300">
  //         <View className="flex-1 items-center justify-center">
  //           <Text>Sort By: ASC</Text>
  //         </View>
  //         <View className="flex-1">
  //           <Text>Yo</Text>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // });

  const renderListItem = ({ item }: ListRenderItemInfo<Testimony | Event>) => {
    return <Card post={item} />;
  };

  const itemSeparatorComponent = () => <CustomSectionSeparator />;

  // Retrieves component to display when there are no posts to show
  const showItemOnEmptyList = useCallback(() => {
    return (
      <View>
        <Text className="text-center dark:text-white text-xl">
          Hmm... Looks like there are no items yet.
        </Text>
      </View>
    );
  }, []);

  // Retrieves component to display when there was an error retrieving posts
  const showItemOnError = useCallback(() => {
    return (
      <View>
        <Text className="text-center dark:text-white text-xl">
          Hmm... Looks like an error occurred.
        </Text>
      </View>
    );
  }, []);

  // Sets the initial state of the list on component load.
  useEffect(() => {
    onComponentRefreshed(true);
  }, []);

  // Switches the current post type in use
  const onSwitchPostType = () => {
    if (postType == "testimony") {
      setPostType("event");
    } else {
      setPostType("testimony");
    }
  };

  /**
   * Retrieves the next batch of testimony posts and appends them to the testimony list.
   * @param lastVisibleTestimonyDoc
   */
  const getTestimonyPosts = async (
    lastVisibleTestimonyDoc: QueryDocumentSnapshot | undefined = undefined
  ) => {
    const [data, lastDoc]: [Testimony[], QueryDocumentSnapshot | undefined] =
      await getTestimonies(lastVisibleTestimonyDoc);
    dispatch(addTestimonyPosts(data));
    if (data.length < QUERY_LIMIT) {
      lastTestimonyDocReachedRef.current = true;
    }
    lastVisibleTestimonyDocRef.current = lastDoc;
    if (lastVisibleTestimonyDoc != undefined) {
      setTestimonies((prev) => (prev ? [...prev, ...data] : data));
    } else {
      setTestimonies(data);
    }
  };

  // Retrieves the next batch of event posts and appends them to the event list.
  const getEventPosts = async (
    lastVisibleEventDoc: QueryDocumentSnapshot | undefined = undefined
  ) => {
    const [data, lastDoc]: [Event[], QueryDocumentSnapshot | undefined] =
      await getEvents(lastVisibleEventDoc);
    dispatch(addEventPosts(data));
    if (data.length < QUERY_LIMIT) {
      lastEventDocReachedRef.current = true;
    }
    lastVisibleEventDocRef.current = lastDoc;
    if (lastVisibleEventDoc != undefined) {
      setEvents((prev) => (prev ? [...prev, ...data] : data));
    } else {
      setEvents(data);
    }
  };

  // Loads more data when the end of the current list is reached.
  const onEndReached = async () => {
    console.log("end reached.");
    if (
      (postType === "testimony" &&
        (lastTestimonyDocReachedRef.current ||
          lastVisibleTestimonyDocRef.current == undefined)) ||
      (postType === "event" &&
        (lastEventDocReachedRef.current ||
          lastVisibleEventDocRef.current == undefined))
    ) {
      console.log("Last doc Reached.");
      return;
    }

    console.log("Trying to load more...");
    setIsLoading(true);
    if (postType === "testimony") {
      await getTestimonyPosts(lastVisibleTestimonyDocRef.current);
    } else {
      await getEventPosts(lastVisibleEventDocRef.current);
    }
    setIsLoading(false);
  };

  // Retrieves initial posts
  const onComponentRefreshed = async (loadAllPosts = false) => {
    resetData();
    await initialLoad(loadAllPosts);
  };

  // Resets all info about posts to its initial state
  const resetData = () => {
    dispatch(resetAllComments());
    if (postType == "testimony") {
      dispatch(resetTestimonyPosts());
      lastVisibleTestimonyDocRef.current = undefined;
      lastTestimonyDocReachedRef.current = false;
      setTestimonies(() => []);
    } else {
      dispatch(resetEventPosts());
      lastVisibleEventDocRef.current = undefined;
      lastEventDocReachedRef.current = false;
      setEvents(() => []);
    }
  };

  const initialLoad = async (loadAllPosts = false) => {
    setIsLoading(true);
    if (loadAllPosts) {
      await getTestimonyPosts();
      await getEventPosts();
    } else {
      if (postType === "testimony") {
        await getTestimonyPosts();
      } else {
        await getEventPosts();
      }
    }
    setIsLoading(false);
  };

  const onPostAdded = () => {
    router.push({
      pathname: "/(tabs)/posts/createPost",
      params: {
        type: postType,
      },
    });
  };

  return (
    <View className="py-safe dark:bg-odbm-gray-digital flex flex-1">
      <View className="py-3 px-4 border-b-2 border-odbm-blue-600 dark:border-odbm-blue-700">
        {/* Header */}
        <View className="h-12 flex flex-row items-center px-2">
          <View className="flex-1 flex flex-row">
            {/* Title */}
            <Text className="text-4xl tracking-wide font-bold text-odbm-blue-600 dark:text-white">
              {postSectionTitle} Posts
            </Text>
          </View>
          {/* Button to switch post type*/}
          <TouchableOpacity className="p-2" onPress={onSwitchPostType}>
            <Octicons
              name="arrow-switch"
              size={28}
              color={colorScheme == "light" ? "#173A64" : "white"}
            />
          </TouchableOpacity>
          {/* Button to add a post */}
          <TouchableOpacity className="p-2" onPress={onPostAdded}>
            <FontAwesome6
              name="plus"
              size={24}
              color={colorScheme == "light" ? "#173A64" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 dark:bg-odbm-gray-digital">
        <FlashList
          contentContainerClassName="w-full flex py-3"
          data={postData}
          renderItem={
            postData == undefined && !isLoading
              ? showItemOnError
              : postData != undefined && postData.length == 0
              ? showItemOnEmptyList
              : renderListItem
          }
          className="w-full dark:bg-odbm-gray-digital"
          ItemSeparatorComponent={itemSeparatorComponent}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={onComponentRefreshed}
          estimatedItemSize={230}
        />
      </View>
    </View>
  );
};
export default Index;
