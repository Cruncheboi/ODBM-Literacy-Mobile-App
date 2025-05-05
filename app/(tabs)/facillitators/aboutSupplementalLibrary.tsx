import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import YoutubePlayer from "@/components/youtubePlayer";
import { router } from "expo-router";
import { View } from "react-native";

const AboutSupplementalLibrary = () => {
  return (
    <CustomHeader title="The Supplemental Library and Its Purpose">
      <View className="py-6" />
      <YoutubePlayer videoId="OGnPEO9z0M0" />
      <CustomOpacityButton
        title="Next"
        className="w-full absolute bottom-0 left-0"
        // Go to 'Higher Level Thinking'
        onPress={() => {
          router.push("/(tabs)/facillitators/aboutChurchImplementation");
        }}
      />
    </CustomHeader>
  );
};
export default AboutSupplementalLibrary;
