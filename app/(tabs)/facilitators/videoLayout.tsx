import CustomHeader from "@/components/customHeader";
import YoutubePlayer from "@/components/youtubePlayer";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export type VideoInfo = {
  title: string;
  videoId: string;
  videoHeader?: string;
  videoFooter?: string;
};

const VideoLayout = () => {
  const { title, videoId, videoHeader, videoFooter } =
    useLocalSearchParams<VideoInfo>();
  return (
    <CustomHeader title={title}>
      <View className="py-6">
        {videoHeader ? (
          <Text className="text-lg dark:text-white">{videoHeader}</Text>
        ) : (
          <Text className="text-lg dark:text-white">
            Watch to learn more about
            <Text className="font-semibold italic"> {title}</Text>.
          </Text>
        )}
      </View>
      <YoutubePlayer videoId={videoId} />
      <View className="py-6">
        {videoFooter && (
          <Text className="text-lg dark:text-white">{videoFooter}</Text>
        )}
      </View>
    </CustomHeader>
  );
};
export default VideoLayout;
