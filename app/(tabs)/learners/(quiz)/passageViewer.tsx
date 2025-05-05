import CustomBackButton from "@/components/customBackButton";
import { Stack, useFocusEffect } from "expo-router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { View, Text, ScrollView } from "react-native";
import { PassageContext } from "../assessment";
import getThemeMainColor, {
  getThemeFontColor,
} from "@/utility_functions/themeColor";
import { useColorScheme } from "nativewind";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const PassageViewer = () => {
  const { book, chapter, verses } = useContext(PassageContext);
  const [showText, setShowText] = useState(1);

  const { colorScheme } = useColorScheme();
  const opacity = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      console.log("Hello, I'm focused!");
      // opacity.value = withDelay(300, withTiming(1));
      setShowText(1);

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log("This route is now unfocused.");
        opacity.value = 0;
        setShowText(0);
      };
    }, [])
  );

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
      <ScrollView className="dark:bg-odbm-gray-dark">
        <Animated.Text
          // style={animatedStyles}
          key={showText}
          entering={FadeIn.delay(300)}
          className="dark:text-white px-4 py-2 leading-6"
        >
          {verses.map(({ verseNumber, verse }, index) => {
            return (
              <React.Fragment key={index}>
                <Animated.View
                  key={index}
                  className="px-[2px]"
                  entering={FadeIn.delay(300)}
                >
                  <Text key={verseNumber} className="text-xs text-gray-500">
                    {verseNumber}
                  </Text>
                </Animated.View>
                <Text key={verse}>{verse}</Text>
              </React.Fragment>
            );
          })}
        </Animated.Text>
      </ScrollView>
    </View>
  );
};
export default PassageViewer;
