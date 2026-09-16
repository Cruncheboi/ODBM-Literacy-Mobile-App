import Card from "@/components/postCard";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { auth } from "@/firebaseConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { useAppDispatch } from "@/redux/hooks";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import ScrollToButton from "@/components/scrollToButton";
import useListScrollController from "@/hooks/useListScrollController";
import { CreatePostSearchParams } from "@/app/postActions/createPost";
import {
  getThemeFontColor,
  getThemeHighlightColor,
} from "@/utility_functions/themeColor";
import { useGetTestimoniesFeedInfiniteQuery } from "@/redux/query_services/injectedEndpoints.ts/testimonies";
import { TestimonyPost } from "@/definitions/posts";
import { databaseApi } from "@/redux/query_services/databaseApi";
import { listEmptyComponent } from "@/components/posts/feed";

const Index = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();

  // Post state
  console.log(`auth ${auth.currentUser?.uid}`);
  const { data, isFetching, fetchNextPage } =
    useGetTestimoniesFeedInfiniteQuery({ userId: auth.currentUser?.uid });
  const testimonies = data?.pages.flatMap((data) => data.data) ?? [];
  const hasMore = data?.pages[data?.pages.length - 1].hasMore;

  // FlashList state
  const flashListRef = useRef<FlashList<TestimonyPost> | null>(null);
  const { showScrollToButton, onScrollToPressed, onScroll } =
    useListScrollController(flashListRef);

  const renderListItem = ({ item }: ListRenderItemInfo<TestimonyPost>) => {
    console.log(item.postType);
    return <Card post={item} />;
  };

  // FLASHLIST CALLBACKS
  const onEndReached = async () => {
    console.log("last doc reached.");
    if (!hasMore || isFetching) return;
    fetchNextPage();
  };

  const onRefresh = async () => {
    dispatch(databaseApi.util.invalidateTags([{ type: "Testimonies" }]));
  };

  const onAddPostPressed = () => {
    router.push({
      pathname: "/postActions/createPost",
      params: {
        type: "testimony",
      } as CreatePostSearchParams,
    });
  };

  const onSwitchPostPressed = () => {
    router.navigate("/(tabs)/posts/events");
  };

  return (
    <View className="py-safe flex flex-1 bg-primary">
      <View className="border-b-2 border-textColor-body px-4 py-3">
        {/* Header */}
        <View className="flex h-12 flex-row items-center px-2">
          <View className="flex flex-1 flex-row">
            {/* Title */}
            <Text className="text-4xl font-bold tracking-wide text-textColor-primary">
              Testimony Posts
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
          className="w-full bg-primary"
          data={testimonies}
          renderItem={renderListItem}
          ListEmptyComponent={listEmptyComponent}
          ItemSeparatorComponent={() => <CustomSectionSeparator />}
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
export default Index;
