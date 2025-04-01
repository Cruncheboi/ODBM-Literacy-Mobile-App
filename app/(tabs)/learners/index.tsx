import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import useDidMountEffect from "@/effects/useDidMountEffect";
import CustomOpacityButton from "@/components/customOpacityButton";
import VocabPage from "./vocabPage";

const Index = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const pages = [<VocabPage />];

  return (
    <View className="flex-1 justify-start items-center">
      <CustomOpacityButton
        onPress={() => {
          router.push("/(tabs)/learners/vocabPage");
        }}
        title="vocabPage"
      />
    </View>
  );
};
export default Index;
