import Card from "@/components/postCard";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { auth } from "@/firebaseConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  FlashList,
  FlashListRef,
  ListRenderItemInfo,
} from "@shopify/flash-list";
import ScrollToButton from "@/components/scrollToButton";
import useListScrollController from "@/hooks/useListScrollController";
import { CreatePostSearchParams } from "../../postActions/createPost";
import Octicons from "@expo/vector-icons/Octicons";
import { useGetEventsFeedInfiniteQuery } from "@/redux/query_services/injectedEndpoints.ts/events";
import { listEmptyComponent } from "@/components/posts/feed";
import { EventPost } from "@/definitions/posts";
import { getThemeFontColor } from "@/utility_functions/themeColor";

const Events = () => {
  const { colorScheme } = useColorScheme();
  const currentAuthId = auth.currentUser?.uid;

  // Post state
  const { data, isFetching, isError, fetchNextPage, refetch } =
    useGetEventsFeedInfiniteQuery(
      { userAuthId: currentAuthId },
      { skip: !currentAuthId },
    );
  const events = data?.pages?.flatMap((page) => page?.data ?? []) ?? [];
  const hasMore =
    data?.pages && data.pages.length > 0
      ? (data.pages[data.pages.length - 1]?.hasMore ?? false)
      : false;

  // FlashList state
  const flashListRef = useRef<FlashListRef<EventPost> | null>(null);
  const { showScrollToButton, onScrollToPressed, onScroll } =
    useListScrollController(flashListRef);

  // Flashlist components
  const renderListItem = ({ item }: ListRenderItemInfo<EventPost>) => {
    return <Card post={item} />;
  };

  // FlashList callbacks
  const onEndReached = async () => {
    console.log("last doc reached.");
    if (!hasMore || isFetching) return;
    fetchNextPage();
  };

  const onRefresh = async () => {
    refetch();
  };

  const onAddPostPressed = () => {
    router.push({
      pathname: "/postActions/createPost",
      params: {
        type: "event",
      } as CreatePostSearchParams,
    });
  };

  const onSwitchPostPressed = () => {
    router.navigate("/(tabs)/posts");
  };

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
              color={getThemeFontColor(colorScheme)}
            />
          </TouchableOpacity>
          {/* Button to add a post */}
          <TouchableOpacity className="p-2" onPress={onAddPostPressed}>
            <FontAwesome6
              name="plus"
              size={24}
              color={getThemeFontColor(colorScheme)}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="relative flex-1 bg-primary">
        <FlashList
          contentContainerClassName="w-full flex py-3"
          data={events}
          renderItem={renderListItem}
          ListEmptyComponent={() => listEmptyComponent(isFetching, isError)}
          className="w-full bg-primary"
          ItemSeparatorComponent={() => <CustomSectionSeparator />}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshing={isFetching}
          onRefresh={onRefresh}
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
