import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import YoutubePlayer from "@/components/youtubePlayer";
import { router } from "expo-router";
import { View } from "react-native";

const AboutLiteracyKit = () => {
  return (
    <CustomHeader title="What is the Literacy Kit and How to Use It?">
      <View className="py-6" />
      <YoutubePlayer videoId="eRmG66vbvEY" />
      <CustomOpacityButton
        title="Next"
        className="w-full absolute bottom-0 left-0"
        onPress={() => {
          router.push("/(tabs)/facillitators/aboutSupplementalLibrary");
        }}
      />
    </CustomHeader>
  );
};
export default AboutLiteracyKit;
