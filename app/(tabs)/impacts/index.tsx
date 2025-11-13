import Card from "@/components/card";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { Testimony } from "@/firebaseConfig";
import { getTestimonies } from "@/firebase_functions/firebaseFunctions";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useColorScheme } from "nativewind";
import { forwardRef, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from "react-native";

type ImpactDoc = QueryDocumentSnapshot | undefined;

const Index = () => {
  const basicTextClassName = "text-odbm-gray dark:text-white";
  const { colorScheme } = useColorScheme();
  const [testimonies, setTestimonies] = useState<Testimony[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastDocReached, setLastDocReached] = useState(false);
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
    ({ item }: ListRenderItemInfo<Testimony>) => {
      return <Card testimony={item} />;
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

  const showItemOnError = useCallback(() => {
    return (
      <View>
        <Text className="text-center dark:text-white text-xl">
          Hmm... Looks like an error occurred.
        </Text>
      </View>
    );
  }, []);

  const [lastVisibleDoc, setLastVisibleDoc] = useState<ImpactDoc>(undefined);
  const onEndReached = async () => {
    if (lastDocReached) return;
    console.log("end reached. Trying to load more...");
    setIsLoading(true);
    const [data, lastDoc, error]: [Testimony[], ImpactDoc, boolean] =
      await getTestimonies(lastVisibleDoc);
    if (data.length == 0) {
      setLastDocReached(true);
    }
    setIsLoading(false);
    setLastVisibleDoc(lastDoc);
    setTestimonies((prev) => (prev ? [...prev, ...data] : data));
  };

  // Retrieves initial posts
  const onComponentLoaded = useCallback(async () => {
    console.log("attempting testimony retrieval");
    setIsLoading(true);
    const [data, lastDoc, error]: [Testimony[], ImpactDoc, boolean] =
      await getTestimonies();
    setLastVisibleDoc(lastDoc);
    setIsLoading(false);
    setTestimonies(data);
  }, []);

  return (
    <View className="py-safe dark:bg-odbm-gray-digital flex flex-1">
      <View className="py-3 px-4 border-b-2 border-odbm-blue-600 dark:border-odbm-blue-700">
        {/* Header */}
        <View className="h-10 flex flex-row items-center px-2">
          <Text className="text-4xl tracking-wide font-bold text-odbm-blue-600 dark:text-white flex-1">
            Impact Posts
          </Text>
          {/* "Add a Post" Button */}
          <TouchableOpacity
            className="p-2"
            onPress={() => {
              router.push("/(tabs)/impacts/createPost");
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
          data={testimonies}
          renderItem={
            testimonies == undefined && !isLoading
              ? showItemOnError
              : testimonies != undefined && testimonies.length == 0
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
        {/** )*/}
      </View>
    </View>
  );
};
export default Index;
