import Card from "@/components/postCard";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { Event } from "@/firebaseConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAppDispatch } from "@/redux/hooks";

import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import ScrollToButton from "@/components/scrollToButton";
import useListScrollController from "@/hooks/useListScrollController";
import { CreatePostSearchParams } from "../../postActions/createPost";
import Octicons from "@expo/vector-icons/Octicons";
import { useGetEventsInfiniteQuery } from "@/redux/services/injectedEndpoints.ts/events";
import { firestoreApi } from "@/redux/services/firestore";
import { QUERY_LIMIT } from "@/firebase_functions/firebaseFunctions";

const Events = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();

  // Post state
  const { data, isFetching, fetchNextPage } =
    useGetEventsInfiniteQuery(undefined);
  const events = data?.pages.flatMap((data) => data) ?? [];

  // FlashList state
  const flashListRef = useRef<FlashList<Event> | null>(null);
  const { showScrollToButton, onScrollToPressed, onScroll } =
    useListScrollController(flashListRef);

  const renderListItem = ({ item }: ListRenderItemInfo<Event>) => {
    return <Card post={item} />;
  };

  // Flashlist components
  const itemSeparatorComponent = useCallback(
    () => <CustomSectionSeparator />,
    [],
  );

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

  // FlashList callbacks
  const onEndReached = async () => {
    console.log("last doc reached.");
    if (events.length < QUERY_LIMIT || isFetching) return;
    fetchNextPage();
  };

  const onRefresh = useCallback(async () => {
    dispatch(firestoreApi.util.invalidateTags([{ type: "Event", id: "LIST" }]));
  }, []);

  const onAddPostPressed = useCallback(() => {
    router.push({
      pathname: "/postActions/createPost",
      params: {
        type: "event",
      } as CreatePostSearchParams,
    });
  }, []);

  const onSwitchPostPressed = useCallback(() => {
    router.navigate("/(tabs)/posts");
  }, []);

  return (
    <View className="py-safe flex flex-1 bg-primary">
      <View className="border-b-2 border-textColor-primary px-4 py-3">
        {/* Header */}
        <View className="flex h-12 flex-row items-center px-2">
          <View className="flex flex-1 flex-row">
            {/* Title */}
            <Text className="text-4xl font-bold tracking-wide text-textColor-primary">
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
      <View className="relative flex-1 bg-primary">
        <FlashList
          contentContainerClassName="w-full flex py-3"
          data={events}
          renderItem={renderListItem}
          ListEmptyComponent={listEmptyComponent}
          className="w-full bg-primary"
          ItemSeparatorComponent={itemSeparatorComponent}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshing={isFetching}
          onRefresh={onRefresh}
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
export default Events;
