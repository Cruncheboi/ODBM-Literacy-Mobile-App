import CustomBackButton from "@/components/customBackButton";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useContext } from "react";
import { View, Text, ScrollView } from "react-native";
import { PassageContext } from "../assessment";
import getThemeMainColor, {
  getThemeFontColor,
} from "@/utility_functions/themeColor";
import { useColorScheme } from "nativewind";

type SearchParams = {
  title: string;
};

const PassageViewer = () => {
  const { book, chapter, verses } = useContext(PassageContext);
  const { colorScheme } = useColorScheme();
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Text className="pl-3 text-2xl font-bold dark:text-odbm-light">
              {book} {chapter}:{verses[0].verseNumber}-
              {verses[verses.length - 1].verseNumber}
            </Text>
          ),
          headerStyle: { backgroundColor: getThemeMainColor(colorScheme) },
          headerTintColor: getThemeFontColor(colorScheme),
          headerLeft: () => <CustomBackButton />,
        }}
      />
      <ScrollView nestedScrollEnabled className="dark:bg-odbm-gray-dark">
        <Text className="dark:text-white px-4 py-2">
          {verses.map(({ verseNumber, verse }, index) => {
            return (
              <React.Fragment key={index}>
                <View key={index} className="px-[2px]">
                  <Text key={verseNumber} className="text-xs text-gray-500">
                    {verseNumber}
                  </Text>
                </View>
                <Text key={verse}>{verse}</Text>
              </React.Fragment>
            );
          })}
        </Text>
      </ScrollView>
    </View>
  );
};
export default PassageViewer;
