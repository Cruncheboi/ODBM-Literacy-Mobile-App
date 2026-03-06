import Card from "@/components/postCard";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { Event, PostType, Testimony } from "@/firebaseConfig";
import {
  getEvents,
  getTestimonies,
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
import {
  FlashList,
  ListRenderItemInfo,
  useBenchmark,
} from "@shopify/flash-list";
import ScrollToButton from "@/components/scrollToButton";
import ListFilter from "@/components/listFilter";
import useListScrollController from "@/hooks/useListScrollController";
import useListDataController from "@/hooks/useListDataController";

const Index = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();

  // Post state
  const [postType, setPostType] = useState<PostType>("testimony");
  const testimonyListData = useListDataController<Testimony>({
    dataInUse: postType === "testimony",
    getData: getTestimonies,
    updateLocalStorage: (data) => dispatch(addTestimonyPosts(data)),
    resetLocalStorage: () => dispatch(resetTestimonyPosts()),
  });
  const eventListData = useListDataController<Event>({
    dataInUse: postType === "event",
    getData: getEvents,
    updateLocalStorage: (data) => dispatch(addEventPosts(data)),
    resetLocalStorage: () => dispatch(resetEventPosts()),
  });
  const isLoading = testimonyListData.isLoading || eventListData.isLoading;
  const postSectionTitle = postType == "testimony" ? "Impact" : "Event";
  // Retrieves the post data that should currently be in use
  const postData =
    postType == "testimony" ? testimonyListData.data : eventListData.data;

  // FlashList state
  const flashListRef = useRef<FlashList<Testimony | Event> | null>(null);
  const { showScrollToButton, onScrollToPressed, onScroll } =
    useListScrollController(flashListRef);

  // A filter component
  const filter = forwardRef(() => {
    return (
      <View className="w-full h-16">
        <Text>YO this is the filter</Text>
      </View>
    );
    // return (
    //   <View className="my-4 px-4 border-2 w-5/12 h-14 rounded-full border-odbm-blue-600 dark:border-slate-700 bg-odbm-gray flex">
    //     <View className="flex-1 flex-row bg-purple-300">
    //       <View className="flex-1 items-center justify-center">
    //         <Text>Sort By: ASC</Text>
    //       </View>
    //       <View className="flex-1">
    //         <Text>Yo</Text>
    //       </View>
    //     </View>
    //   </View>
    // );
  });

  const renderListItem = ({ item }: ListRenderItemInfo<Testimony | Event>) => {
    return <Card post={item} />;
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
    if (isLoading) {
      return null;
    }

    if (postData == undefined) {
      return showItemOnError();
    }
    return showItemOnEmptyList();
  };

  // Sets the initial state of the list on component load.
  useEffect(() => {
    onListRefreshed();
  }, []);

  // Switches the current post type in use
  const onSwitchPostType = () => {
    if (postType == "testimony") {
      setPostType("event");
    } else {
      setPostType("testimony");
    }
  };

  // Loads more data when the end of the current list is reached.
  const onEndReached = async () => {
    await testimonyListData.onEndReached();
    await eventListData.onEndReached();
  };

  // Retrieves initial posts
  const onListRefreshed = async () => {
    await testimonyListData.onListRefreshed();
    await eventListData.onListRefreshed();
  };

  const onAddPostPressed = () => {
    router.push({
      pathname: "/postActions/createPost",
      params: {
        type: postType,
      },
    });
  };

  const listHeaderComponent = () => {
    return (
      <View className="px-4 border-2 w-5/12 h-14 rounded-full border-odbm-blue-600 dark:border-slate-700 bg-odbm-gray-digital flex">
        <View className="flex-1 items-center justify-center">
          <Text className="dark:text-white">My posts</Text>
        </View>
      </View>
    );
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
          <TouchableOpacity className="p-2" onPress={onAddPostPressed}>
            <FontAwesome6
              name="plus"
              size={24}
              color={colorScheme == "light" ? "#173A64" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 dark:bg-odbm-gray-digital relative">
        <FlashList
          // maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          contentContainerClassName="w-full flex py-3"
          data={postData}
          // ListHeaderComponent={listHeaderComponent}
          renderItem={renderListItem}
          ListEmptyComponent={listEmptyComponent}
          className="w-full dark:bg-odbm-gray-digital"
          ItemSeparatorComponent={itemSeparatorComponent}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
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
    </View>
  );
};
export default Index;
