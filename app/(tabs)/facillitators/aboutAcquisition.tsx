import { View } from "react-native";
import CustomHeader from "@/components/customHeader";
import YoutubePlayer from "@/components/youtubePlayer";
import CustomOpacityButton from "@/components/customOpacityButton";
import { router } from "expo-router";
const AboutAcquisition = () => {
  return (
    <CustomHeader title="Acquisition Order and Time">
      <View className="py-6" />
      <YoutubePlayer videoId="L3hZDZBwEEI" />
      <CustomOpacityButton
        title="Next"
        className="w-full absolute bottom-0 left-0"
        onPress={() => {
          router.push("/(tabs)/facillitators/aboutAssessment");
        }}
      />
    </CustomHeader>
  );
};
export default AboutAcquisition;
