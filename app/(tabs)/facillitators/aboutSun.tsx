import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import YoutubePlayer from "@/components/youtubePlayer";
import { router } from "expo-router";
import { View } from "react-native";

const AboutSun = () => {
  return (
    <CustomHeader title="Let's Learn About SUN">
      <View className="py-6" />
      <YoutubePlayer videoId="Lv3W6dvDVOE" />
      <CustomOpacityButton
        title="Next"
        className="w-full absolute bottom-0 left-0"
        // Go to game
        onPress={() => {
          router.push("/(tabs)/facillitators/aboutLiteracyKit");
        }}
      />
    </CustomHeader>
  );
};
export default AboutSun;
