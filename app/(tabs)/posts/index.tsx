import Card from "@/components/postCard";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { Event, Testimony } from "@/firebaseConfig";
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
import { useGetTestimoniesInfiniteQuery } from "@/redux/services/injectedEndpoints.ts/testimonies";
import { firestoreApi } from "@/redux/services/firestore";
import { QUERY_LIMIT } from "@/firebase_functions/firebaseFunctions";

const Index = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();

  // Post state
  const { data, isFetching, fetchNextPage } =
    useGetTestimoniesInfiniteQuery(undefined);
  const testimonies = data?.pages.flatMap((data) => data) ?? [];

  // FlashList state
  const flashListRef = useRef<FlashList<Testimony | Event> | null>(null);
  const { showScrollToButton, onScrollToPressed, onScroll } =
    useListScrollController(flashListRef);

  const renderListItem = ({ item }: ListRenderItemInfo<Testimony | Event>) => {
    return <Card post={item} />;
  };

  // Flashlist Components
  const itemSeparatorComponent = useCallback(
    () => <CustomSectionSeparator />,
    [],
  );

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
    if (testimonies.length < QUERY_LIMIT || isFetching) return;
    fetchNextPage();
  };

  const onRefresh = useCallback(async () => {
    dispatch(
      firestoreApi.util.invalidateTags([{ type: "Testimony", id: "List" }]),
    );
  }, []);

  const onAddPostPressed = useCallback(() => {
    router.push({
      pathname: "/postActions/createPost",
      params: {
        type: "testimony",
      } as CreatePostSearchParams,
    });
  }, []);

  const onSwitchPostPressed = useCallback(() => {
    router.navigate("/(tabs)/posts/events");
  }, []);

  return (
    <View className="py-safe dark:bg-odbm-gray-digital flex flex-1">
      <View className="py-3 px-4 border-b-2 border-odbm-blue-600 dark:border-odbm-blue-700">
        {/* Header */}
        <View className="h-12 flex flex-row items-center px-2">
          <View className="flex-1 flex flex-row">
            {/* Title */}
            <Text className="text-4xl tracking-wide font-bold text-odbm-blue-600 dark:text-white">
              Testimony Posts
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
          contentContainerClassName="w-full flex py-3"
          className="w-full dark:bg-odbm-gray-digital"
          data={testimonies}
          renderItem={renderListItem}
          ListEmptyComponent={listEmptyComponent}
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
export default Index;
