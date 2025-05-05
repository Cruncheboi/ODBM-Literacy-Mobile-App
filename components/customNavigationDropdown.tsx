import { View, Text, FlatList } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useColorScheme } from "nativewind";
import { getThemeFontColor } from "@/utility_functions/themeColor";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useCallback, useEffect, useState } from "react";
import CustomSectionItem from "./customSectionItem";
export type NavigationDropdownItem = {
  title: string;
  onTap: () => void;
};

interface Props {
  title: string;
  data: NavigationDropdownItem[];
}

const CustomNavigationDropdown = ({ title, data }: Props) => {
  const listHeight = useSharedValue(0);
  const { colorScheme } = useColorScheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const iconSize = 34;

  useEffect(() => {
    listHeight.value = withTiming(showDropdown ? 200 : 0, {
      duration: 200,
      easing: Easing.inOut(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
  }, [showDropdown]);

  const onPress = () => {
    setShowDropdown(!showDropdown);
  };
  const dropdownTapGesture = Gesture.Tap().runOnJS(true).onEnd(onPress);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: listHeight.value,
    };
  });
  const dropdownList = useCallback(() => {
    return (
      <Animated.FlatList
        contentContainerClassName="w-full gap-3 p-6"
        data={data}
        entering={FadeIn.duration(500)}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => {
          return (
            <CustomSectionItem
              key={item.title}
              title={item.title}
              onPress={() => {
                setShowDropdown(false);
                item.onTap();
              }}
              className="h-12"
              textStyles="font-semibold text-xl text-center"
            />
          );
        }}
      />
    );
  }, [data]);

  return (
    <>
      <View className="flex flex-row items-center justify-start gap-4 py-3 w-full px-5 border-b border-odbm-blue-600 dark:border-slate-700 dark:bg-odbm-gray-digital">
        {/** header */}
        <GestureDetector gesture={dropdownTapGesture}>
          <View className="w-full flex flex-row">
            <View collapsable={false} className="px-2">
              {!showDropdown ? (
                <AntDesign
                  name="down"
                  size={iconSize}
                  color={colorScheme == "dark" ? "white" : "#173a64"}
                />
              ) : (
                <AntDesign
                  name="up"
                  size={iconSize}
                  color={colorScheme == "dark" ? "white" : "#173a64"}
                />
              )}
            </View>
            <Text className="text-4xl font-bold text-odbm-blue-600 dark:text-white flex-1 text-center">
              {title}
            </Text>
          </View>
        </GestureDetector>
      </View>
      {/** dropdown */}
      <Animated.View
        style={animatedStyle}
        className="w-full border-b border-odbm-blue-600 dark:border-slate-700"
      >
        {showDropdown && dropdownList()}
      </Animated.View>
    </>
  );
};
export default CustomNavigationDropdown;
