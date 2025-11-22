import Card from "@/components/card";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { Event, Testimony } from "@/firebaseConfig";
import {
  getEvents,
  getTestimonies,
} from "@/firebase_functions/firebaseFunctions";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useColorScheme } from "nativewind";
import { forwardRef, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";

type PostDoc = QueryDocumentSnapshot | undefined;
export type Post = "testimony" | "event";

const Index = () => {
  const { colorScheme } = useColorScheme();
  const [postData, setPostData] = useState<Testimony[] | Event[] | undefined>();
  const [postSectionTitle, setPostSectionTitle] = useState<string>("Impact");
  const [testimonies, setTestimonies] = useState<Testimony[] | undefined>(
    undefined
  );
  const [events, setEvents] = useState<Event[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [lastTestimonyDocReached, setLastTestimonyDocReached] = useState(false);
  const [lastEventDocReached, setLastEventDocReached] = useState(false);
  const [lastVisibleTestimonyDoc, setLastVisibleTestimonyDoc] =
    useState<PostDoc>(undefined);
  const [lastVisibleEventDoc, setLastVisibleEventDoc] =
    useState<PostDoc>(undefined);
  const [postType, setPostType] = useState<Post>("testimony");
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

  const renderListItem = useCallback(
    ({ item }: ListRenderItemInfo<Testimony | Event>) => {
      return <Card post={item} />;
    },
    []
  );

  const itemSeparatorComponent = useCallback(
    () => <CustomSectionSeparator />,
    []
  );

  const showItemOnEmptyList = useCallback(() => {
    return (
      <View>
        <Text className="text-center dark:text-white text-xl">
          Hmm... Looks like there are no items yet.
        </Text>
      </View>
    );
  }, []);

  // Item to display when there was an error retrieving posts
  const showItemOnError = useCallback(() => {
    return (
      <View>
        <Text className="text-center dark:text-white text-xl">
          Hmm... Looks like an error occurred.
        </Text>
      </View>
    );
  }, []);

  // Sets the post section title based on current post type.
  useEffect(() => {
    if (postType === "testimony") {
      setPostSectionTitle("Impact");
    } else {
      setPostSectionTitle("Event");
    }
  }, [postType]);

  // const getPostSectionTitle = useCallback((): string => {
  //   if (postType == "testimony") {
  //     return "Impact";
  //   } else {
  //     return "Event";
  //   }
  // }, [postType]);

  // Switches the current post type in use
  const onSwitchPostType = useCallback(() => {
    if (postType == "testimony") {
      setPostType("event");
    } else {
      setPostType("testimony");
    }
  }, [postType]);

  const getCurrentPostData = useCallback(():
    | Testimony[]
    | Event[]
    | undefined => {
    if (postType == "testimony") {
      return testimonies;
    } else {
      return events;
    }
  }, [postType, testimonies, events]);

  useEffect(() => {
    setPostData(getCurrentPostData());
  }, [postType, testimonies, events]);

  const getTestimonyPosts = useCallback(async () => {
    const [data, lastDoc]: [Testimony[], PostDoc] = await getTestimonies(
      lastVisibleTestimonyDoc
    );
    if (data.length == 0) {
      setLastTestimonyDocReached(true);
    }
    setLastVisibleTestimonyDoc(lastDoc);
    setTestimonies((prev) => (prev ? [...prev, ...data] : data));
  }, [lastVisibleTestimonyDoc, testimonies]);

  const getEventPosts = useCallback(async () => {
    const [data, lastDoc]: [Event[], PostDoc] = await getEvents(
      lastVisibleEventDoc
    );
    if (data.length == 0) {
      setLastEventDocReached(true);
    }
    setLastVisibleEventDoc(lastDoc);
    setEvents((prev) => (prev ? [...prev, ...data] : data));
  }, [lastVisibleEventDoc, events]);

  // Determines what happens when the end of the current list is reached.
  const onEndReached = useCallback(async () => {
    if (
      (lastTestimonyDocReached && postType === "testimony") ||
      (lastEventDocReached && postType === "event")
    ) {
      console.log("Last doc Reached.");
      return;
    }

    console.log("end reached. Trying to load more...");
    setIsLoading(true);
    if (postType === "testimony") {
      await getTestimonyPosts();
    } else {
      await getEventPosts();
    }
    setIsLoading(false);
  }, [
    postType,
    lastTestimonyDocReached,
    lastVisibleTestimonyDoc,
    lastEventDocReached,
    lastVisibleEventDoc,
  ]);

  // Retrieves initial posts
  const onComponentLoaded = useCallback(async () => {
    console.log("attempting post retrieval");
    setIsLoading(true);
    if (postType === "testimony") {
      await getTestimonyPosts();
    } else {
      await getEventPosts();
    }
    setIsLoading(false);
  }, [
    postType,
    lastTestimonyDocReached,
    lastVisibleTestimonyDoc,
    lastEventDocReached,
    lastVisibleEventDoc,
  ]);

  return (
    <View className="py-safe dark:bg-odbm-gray-digital flex flex-1">
      <View className="py-3 px-4 border-b-2 border-odbm-blue-600 dark:border-odbm-blue-700">
        {/* Header */}
        <View className="h-10 flex flex-row items-center px-2">
          <View className="flex-1 flex flex-row items-center">
            {/* Title */}
            <Text className="text-4xl tracking-wide font-bold text-odbm-blue-600 dark:text-white">
              {postSectionTitle} Posts
            </Text>
            {/* Button to switch post type*/}
            <TouchableOpacity className="ml-4" onPress={onSwitchPostType}>
              <Octicons
                name="arrow-switch"
                size={24}
                color={colorScheme == "light" ? "#173A64" : "white"}
              />
            </TouchableOpacity>
          </View>
          {/* Button to add a post */}
          <TouchableOpacity
            className="p-2"
            onPress={() => {
              router.push({
                pathname: "/(tabs)/impacts/createPost",
                params: {
                  type: postType,
                },
              });
            }}
          >
            <FontAwesome6
              name="plus"
              size={24}
              color={colorScheme == "light" ? "#173A64" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 dark:bg-odbm-gray-digital">
        <FlatList
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
          refreshing={isLoading}
          onRefresh={onComponentLoaded}
          // stickyHeaderHiddenOnScroll
          // stickyHeaderIndices={[0]}
          // StickyHeaderComponent={filter}
        />
      </View>
    </View>
  );
};
export default Index;
