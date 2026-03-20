import Card from "@/components/postCard";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { Event } from "@/firebaseConfig";
import { getEvents } from "@/firebase_functions/firebaseFunctions";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { forwardRef, useCallback, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAppDispatch } from "@/redux/hooks";
import { addEventPosts, resetEventPosts } from "@/redux/features/postsSlice";
import { resetCommentCollection } from "@/redux/features/commentsSlice";
import {
  FlashList,
  ListRenderItemInfo,
  useBenchmark,
} from "@shopify/flash-list";
import ScrollToButton from "@/components/scrollToButton";
import useListScrollController from "@/hooks/useListScrollController";
import useListDataController from "@/hooks/useListDataController";
import { CreatePostSearchParams } from "../../postActions/createPost";
import Octicons from "@expo/vector-icons/Octicons";

const Index = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();

  // Post state
  const { data, isLoading, onEndReached, onListRefreshed } =
    useListDataController<Event>({
      dataInUse: true,
      getData: getEvents,
      updateLocalStorage: (events) => dispatch(addEventPosts(events)),
      resetLocalStorage: () => {
        dispatch(resetEventPosts());
        dispatch(resetCommentCollection({ type: "event" }));
      },
    });

  // FlashList state
  const flashListRef = useRef<FlashList<Event> | null>(null);
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

  const renderListItem = ({ item }: ListRenderItemInfo<Event>) => {
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

    if (data == undefined) {
      return showItemOnError();
    }
    return showItemOnEmptyList();
  };

  const onAddPostPressed = () => {
    router.push({
      pathname: "/postActions/createPost",
      params: {
        type: "event",
      } as CreatePostSearchParams,
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

  // Sets the initial state of the list on component load.
  useEffect(() => {
    onListRefreshed();
  }, []);

  const onSwitchPostPressed = () => {
    router.navigate("/(tabs)/posts");
  };

  return (
    <View className="py-safe dark:bg-odbm-gray-digital flex flex-1">
      <View className="py-3 px-4 border-b-2 border-odbm-blue-600 dark:border-odbm-blue-700">
        {/* Header */}
        <View className="h-12 flex flex-row items-center px-2">
          <View className="flex-1 flex flex-row">
            {/* Title */}
            <Text className="text-4xl tracking-wide font-bold text-odbm-blue-600 dark:text-white">
              Event Posts
            </Text>
          </View>
          {/* Button to switch post type*/}
          <TouchableOpacity className="p-2" onPress={onSwitchPostPressed}>
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
          data={data}
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
