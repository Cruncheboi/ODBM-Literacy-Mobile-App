import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import YoutubePlayer from "@/components/youtubePlayer";
import { router } from "expo-router";
import { View } from "react-native";

const AboutProgramOverview = () => {
  return (
    <CustomHeader title="Program Overview">
      <View className="py-6" />
      <YoutubePlayer videoId="qQuuhZXWijc" />
      <CustomOpacityButton
        className="w-full absolute bottom-0 left-0"
        title="Next"
        onPress={() => router.push("/(tabs)/facillitators/aboutAcquisition")}
      />
    </CustomHeader>
  );
};
export default AboutProgramOverview;
