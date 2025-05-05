import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import YoutubePlayer from "@/components/youtubePlayer";
import { router } from "expo-router";
import { View } from "react-native";

const AboutAssessment = () => {
  return (
    <CustomHeader title="What is Assessment?">
      <View className="py-6" />
      <YoutubePlayer videoId="DjnZAZ_tsKE" />
      <CustomOpacityButton
        title="Next"
        className="w-full absolute bottom-0 left-0"
        onPress={() => {
          router.push("/(tabs)/facillitators/aboutSun");
        }}
      />
    </CustomHeader>
  );
};
export default AboutAssessment;
