import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import useDidMountEffect from "@/effects/useDidMountEffect";
import CustomOpacityButton from "@/components/customOpacityButton";
import Vocabulary from "./vocabulary";

const Index = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const pages = [<Vocabulary />];

  return (
    <View className="flex-1 justify-start items-center bg-odbm-gray-digital">
      {/* <Text className="text-white self-start">Resources</Text> */}
      <ScrollView className="w-10/12 h-full" style={{ flex: 4 }}>
        <View className="flex-row flex-1">
          <Text className="text-2xl text-white elevation-sm">Resources</Text>
        </View>

        <View className="flex-row gap-3 my-3">
          <View
            className="bg-white flex-grow h-40 rounded-md justify-center items-center"
            style={{}}
          >
            <Text>Yo</Text>
          </View>
          <View className="bg-highlight flex-grow">
            <Text>Yo</Text>
          </View>
        </View>
        <View className="flex-row">
          <View className="bg-white flex-grow">
            <Text>Yo</Text>
          </View>
          <View className="bg-highlight flex-grow">
            <Text>Yo</Text>
          </View>
        </View>
      </ScrollView>
      <CustomOpacityButton
        onPress={() => {
          router.push("/(tabs)/learners/vocabulary");
        }}
        title="Vocabulary"
      />
    </View>
  );
};
export default Index;
