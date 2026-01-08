import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";
import { Event, Testimony } from "@/firebaseConfig";
import { useCallback } from "react";
import { router } from "expo-router";
import { SearchParams } from "@/app/(tabs)/posts/viewPost";

interface Props {
  post: Testimony | Event;
}

const PostCard = ({ post }: Props) => {
  const { colorScheme } = useColorScheme();
  const date = new Date(post.date);

  const onPressPost = () => {
    router.push({
      pathname: "/(tabs)/posts/viewPost",
      params: {
        postID: post.documentID,
        postType: post.postType,
      } as SearchParams,
    });
  };

  return (
    <View className="w-11/12 self-center p-3 max-h-[340px] rounded-xl">
      <TouchableOpacity className="w-full" onPress={onPressPost}>
        <View className="flex flex-row justify-items-center">
          <Text className="text-odbm-gold">@</Text>
          <View className="flex-1">
            <Text className="text-odbm-gold">{post.displayName}</Text>
          </View>
          <Text className="dark:text-gray-300 text-odbm-blue-600">
            {date.toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <Text className="dark:text-gray-200 text-xl font-bold line-clamp-3 mt-2">
          {post.title}
        </Text>
        <View className="max-h-40 mb-4">
          <Text className="dark:text-gray-300 text-lg line-clamp-5">
            {post.body}
          </Text>
        </View>
        <TouchableOpacity className="w-full border-2 rounded-full border-odbm-blue-600 dark:border-gray-400 items-center py-2">
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color={colorScheme == "light" ? "#173A64" : "#d1d5db"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};
export default PostCard;
