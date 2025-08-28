import Card from "@/components/card";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { Testimony } from "@/firebaseConfig";
import { getTestimonies } from "@/redux/storageSync";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useColorScheme } from "nativewind";
import { forwardRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

const Index = () => {
  const basicTextClassName = "text-odbm-gray dark:text-white";
  const { colorScheme } = useColorScheme();
  const [testimonies, setTestimonies] = useState<Testimony[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
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

  // let data: Testimony[] | undefined;
  let lastVisibleDoc = undefined;
  // Retrieve initial posts
  useEffect(() => {
    (async () => {
      let data;
      setIsLoading(true);
      [data, lastVisibleDoc] = await getTestimonies();
      setTestimonies(data);
      setIsLoading(false);
    })();
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
          <TouchableOpacity className="p-2">
            <FontAwesome6
              name="plus"
              size={24}
              color={colorScheme == "light" ? "#173A64" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 dark:bg-odbm-gray-digital">
        {testimonies == undefined ? (
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-center">
              Hmm... Looks like there are no posts to show.
            </Text>
          )
        ) : (
          <FlatList
            contentContainerClassName="w-full flex py-3"
            data={testimonies}
            renderItem={({ item }) => {
              return (
                <Card
                  testimony={{
                    body: item.body,
                    date: item.date,
                    documentID: item.documentID,
                    title: item.title,
                    user: item.user,
                  }}
                />
              );
            }}
            className="w-full dark:bg-odbm-gray-digital"
            ItemSeparatorComponent={() => <CustomSectionSeparator />}
            // stickyHeaderHiddenOnScroll
            // stickyHeaderIndices={[0]}
            // StickyHeaderComponent={filter}
          />
        )}
      </View>
    </View>
  );
};
export default Index;
