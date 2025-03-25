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
import { WebView } from "react-native-webview";
const Index = () => {
  const vocabSources = {
    vocabA: {
      uri: "https://drive.google.com/file/d/1JTSBP7gx3Vk1UvMJc7-mDOxPmQKkVwmI/view?usp=drive_link",
    },
    vocabB: {
      uri: "https://drive.google.com/file/d/1jez4iBC_oOHxa2YsPW-NQZS1AX8xyFJa/view?usp=drive_link",
    },
  };
  const [vocabSource, setVocabSource] = useState(vocabSources.vocabA);

  useEffect(() => {
    router.push({ pathname: "/(tabs)/learners/vocab", params: vocabSource });
  }, [vocabSource]);

  return (
    <View className="flex-1 justify-start items-center mt-10">
      <TouchableOpacity
        key={vocabSources.vocabB.uri}
        onPress={() => {
          setVocabSource(vocabSources.vocabA);
        }}
        className="w-1/2 bg-secondary min-h-14 rounded-full"
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-xl">Vocab A</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        key={vocabSources.vocabA.uri}
        onPress={() => {
          setVocabSource(vocabSources.vocabB);
        }}
        className="w-1/2 bg-secondary min-h-14 rounded-full mt-5"
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-xl">Vocab B</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default Index;
