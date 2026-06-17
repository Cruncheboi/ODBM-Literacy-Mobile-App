import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";
import { Event, Testimony } from "@/firebaseConfig";
import { useCallback } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ViewPostSearchParams } from "@/app/postActions/viewPost";
import { ViewReportSearchParams } from "@/app/postActions/viewReport";

interface Props {
  post: Testimony | Event;
  isReported?: boolean;
}

const PostCard = ({ post, isReported }: Props) => {
  const { colorScheme } = useColorScheme();
  const date = new Date(post.date);

  const onPressPost = () => {
    if (isReported) {
      router.push({
        pathname: "/postActions/viewReport",
        params: {
          postId: post.documentId,
          contentType: post.contentType,
        } as ViewReportSearchParams,
      });
    } else {
      router.push({
        pathname: "/postActions/viewPost",
        params: {
          postID: post.documentId,
          postType: post.contentType,
        } as ViewPostSearchParams,
      });
    }
  };

  return (
    <View className="max-h-[340px] w-11/12 self-center rounded-xl p-3">
      <TouchableOpacity className="w-full" onPress={onPressPost}>
        <View className="flex flex-row justify-items-center">
          <Text className="text-highlight">@</Text>
          <View className="flex-1">
            <Text className="text-highlight">{post.displayName}</Text>
          </View>
          <Text className="text-textColor-body">
            {date.toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <Text className="mt-2 line-clamp-3 text-xl font-bold text-textColor-title">
          {post.title}
        </Text>
        <View className="max-h-40 pb-4">
          <Text className="line-clamp-5 text-lg text-textColor-body">
            {post.body}
          </Text>
        </View>
        <TouchableOpacity
          className="border-borderColor-primary w-full items-center rounded-full border-2 py-2"
          onPress={onPressPost}
        >
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
