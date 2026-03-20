import Card from "@/components/postCard";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { Event, Testimony } from "@/firebaseConfig";
import { getTestimonies } from "@/firebase_functions/firebaseFunctions";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useColorScheme } from "nativewind";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { useAppDispatch } from "@/redux/hooks";
import {
  addTestimonyPosts,
  resetTestimonyPosts,
} from "@/redux/features/postsSlice";
import {
  logCommentObjects,
  resetCommentCollection,
} from "@/redux/features/commentsSlice";
import {
  FlashList,
  ListRenderItemInfo,
  useBenchmark,
} from "@shopify/flash-list";
import ScrollToButton from "@/components/scrollToButton";
import ListFilter from "@/components/listFilter";
import useListScrollController from "@/hooks/useListScrollController";
import useListDataController from "@/hooks/useListDataController";
import { CreatePostSearchParams } from "@/app/postActions/createPost";

const Index = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();

  // Post state
  const { data, isLoading, onEndReached, onListRefreshed } =
    useListDataController<Testimony>({
      dataInUse: true,
      getData: getTestimonies,
      updateLocalStorage: (data) => dispatch(addTestimonyPosts(data)),
      resetLocalStorage: () => {
        dispatch(resetTestimonyPosts());
        dispatch(logCommentObjects());
        dispatch(resetCommentCollection({ type: "testimony" }));
        dispatch(logCommentObjects());
      },
    });

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

    if (data == undefined) {
      return showItemOnError();
    }
    return showItemOnEmptyList();
  };

  // Sets the initial state of the list on component load.
  useEffect(() => {
    onListRefreshed();
  }, []);

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
          // maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          contentContainerClassName="w-full flex py-3"
          className="w-full dark:bg-odbm-gray-digital"
          data={data}
          // ListHeaderComponent={listHeaderComponent}
          renderItem={renderListItem}
          ListEmptyComponent={listEmptyComponent}
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

// Using RTK Query

// import Card from "@/components/postCard";
// import CustomSectionSeparator from "@/components/customSectionSeparator";
// import { Testimony } from "@/firebaseConfig";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import { router } from "expo-router";
// import { useColorScheme } from "nativewind";
// import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import Octicons from "@expo/vector-icons/Octicons";
// import { useAppDispatch } from "@/redux/hooks";
// import {
//   FlashList,
//   ListRenderItemInfo,
//   useBenchmark,
// } from "@shopify/flash-list";
// import ScrollToButton from "@/components/scrollToButton";
// import ListFilter from "@/components/listFilter";
// import useListScrollController from "@/hooks/useListScrollController";
// import useListDataController from "@/hooks/useListDataController";
// import { CreatePostSearchParams } from "@/app/postActions/createPost";
// import { useGetTestimoniesInfiniteQuery } from "@/redux/services/injectedEndpoints.ts/testimonies";
// import { firestoreApi } from "@/redux/services/firestore";

// const Reports = () => {
//   const dispatch = useAppDispatch();
//   const { colorScheme } = useColorScheme();

//   const { data, isFetching, fetchNextPage, hasNextPage } =
//     useGetTestimoniesInfiniteQuery(undefined);
//   // const testiomonies = data?.pages.flatMap(({ data }) => data) ?? [];
//   const testiomonies = data?.pages.flatMap((data) => data) ?? [];
//   // const [reports, setReports] = useState<Testimony[]>(data?.)

//   // FlashList state
//   const flashListRef = useRef<FlashList<Testimony> | null>(null);
//   const { showScrollToButton, onScrollToPressed, onScroll } =
//     useListScrollController(flashListRef);

//   const renderListItem = ({ item }: ListRenderItemInfo<Testimony>) => {
//     return <Card post={item} />;
//   };

//   const itemSeparatorComponent = () => <CustomSectionSeparator />;

//   // Retrieves component to display when there are no posts to show
//   const showItemOnEmptyList = useCallback(() => {
//     return (
//       <View>
//         <Text className="text-center dark:text-gray-300 text-xl">
//           Hmm... Looks like there are no items yet.
//         </Text>
//       </View>
//     );
//   }, []);

//   // Retrieves component to display when there was an error retrieving posts
//   const showItemOnError = useCallback(() => {
//     return (
//       <View>
//         <Text className="text-center dark:text-gray-300 text-xl">
//           Hmm... Looks like an error occurred.
//         </Text>
//       </View>
//     );
//   }, []);

//   // Returns the component to display on an empty list based on loading and post data state.
//   const listEmptyComponent = () => {
//     if (isFetching) {
//       return null;
//     }

//     if (data == undefined) {
//       return showItemOnError();
//     }
//     return showItemOnEmptyList();
//   };

//   // Sets the initial state of the list on component load.
//   // useEffect(() => {
//   //   onListRefreshed();
//   // }, []);

//   const onAddPostPressed = () => {
//     router.push({
//       pathname: "/postActions/createPost",
//       params: {
//         type: "testimony",
//       } as CreatePostSearchParams,
//     });
//   };

//   const listHeaderComponent = () => {
//     return (
//       <View className="px-4 border-2 w-5/12 h-14 rounded-full border-odbm-blue-600 dark:border-slate-700 bg-odbm-gray-digital flex">
//         <View className="flex-1 items-center justify-center">
//           <Text className="dark:text-white">My posts</Text>
//         </View>
//       </View>
//     );
//   };

//   const onListRefreshed = async () => {
//     dispatch(firestoreApi.util.invalidateTags(["Testimony"]));
//     // dispatch(firestoreApi.util.resetApiState());
//     // refetch();
//   };

//   const onEndReached = async () => {
//     console.log("end reached.");
//     if (isFetching || testiomonies.length == 0) return;
//     console.log("fetching new data.");
//     console.log("Has next page?: ", hasNextPage);
//     fetchNextPage();
//   };

//   return (
//     <View className="py-safe dark:bg-odbm-gray-digital flex flex-1">
//       <View className="py-3 px-4 border-b-2 border-odbm-blue-600 dark:border-odbm-blue-700">
//         {/* Header */}
//         <View className="h-12 flex flex-row items-center px-2">
//           <View className="flex-1 flex flex-row">
//             {/* Title */}
//             <Text className="text-4xl tracking-wide font-bold text-odbm-blue-600 dark:text-white">
//               Testimony Posts
//             </Text>
//           </View>
//           {/* Button to add a post */}
//           <TouchableOpacity className="p-2" onPress={onAddPostPressed}>
//             <FontAwesome6
//               name="plus"
//               size={24}
//               color={colorScheme == "light" ? "#173A64" : "white"}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View className="flex-1 dark:bg-odbm-gray-digital relative">
//         {/* <Card post={} /> */}
//         <FlashList
//           // maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
//           contentContainerClassName="w-full flex py-3"
//           className="w-full dark:bg-odbm-gray-digital"
//           data={testiomonies}
//           // ListHeaderComponent={listHeaderComponent}
//           renderItem={renderListItem}
//           ListEmptyComponent={listEmptyComponent}
//           ItemSeparatorComponent={itemSeparatorComponent}
//           onEndReached={onEndReached}
//           onEndReachedThreshold={0.5}
//           refreshing={isFetching}
//           onRefresh={onListRefreshed}
//           estimatedItemSize={230}
//           ref={flashListRef}
//           onScroll={onScroll}
//         />
//         <ScrollToButton
//           onPress={onScrollToPressed}
//           isHidden={!showScrollToButton}
//         />
//       </View>
//     </View>
//   );
// };
// export default Reports;
