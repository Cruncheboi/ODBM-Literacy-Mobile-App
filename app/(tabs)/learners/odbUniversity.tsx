import CustomOpacityButton from "@/components/customOpacityButton";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

const ODBUniversity = () => {
  return (
    <SafeAreaView className="flex-1">
      <WebView
        className="flex-1"
        source={{
          uri: "https://www.google.com/url?q=https%3A%2F%2Fodbu.org%2Fall-courses%2F%3F_sfm_display_free_lessons%3D1&sa=D&sntz=1&usg=AOvVaw32_6fUk3OyJHA-BahZkvDx",
        }}
      />
    </SafeAreaView>
  );
};
export default ODBUniversity;
