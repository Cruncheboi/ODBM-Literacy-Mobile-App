import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import YoutubePlayer from "@/components/youtubePlayer";
import { router } from "expo-router";
import { View } from "react-native";

const AboutChurchImplementation = () => {
  return (
    <CustomHeader title="Church Implementation">
      <View className="py-6" />
      <YoutubePlayer videoId="WWOt8yihN5k" />
    </CustomHeader>
  );
};
export default AboutChurchImplementation;
