import { View, Text, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useColorScheme } from "nativewind";
import Animated, {
  Easing,
  FadeIn,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useCallback, useEffect, useState } from "react";
import CustomSectionItem from "./customSectionItem";
import { getThemeFontColor } from "@/utility_functions/themeColor";
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
  const { height } = useWindowDimensions();
  const iconSize = 34;

  const dropdownHeight = Math.round(height * 0.75);

  useEffect(() => {
    listHeight.value = withTiming(showDropdown ? dropdownHeight : 0, {
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
      <View className="flex w-full flex-row items-center justify-start gap-4 border-b border-textColor-primary bg-primary px-5 py-3">
        {/** header */}
        <GestureDetector gesture={dropdownTapGesture}>
          <View className="flex w-full flex-row">
            <Text className="flex-1 text-center text-4xl font-bold text-textColor-primary">
              {title}
            </Text>
            <View collapsable={false} className="px-2">
              {!showDropdown ? (
                <AntDesign
                  name="down"
                  size={iconSize}
                  color={getThemeFontColor(colorScheme)}
                />
              ) : (
                <AntDesign
                  name="up"
                  size={iconSize}
                  color={getThemeFontColor(colorScheme)}
                />
              )}
            </View>
          </View>
        </GestureDetector>
      </View>
      {/** dropdown */}
      <Animated.View
        style={animatedStyle}
        className="w-full border-b border-textColor-primary"
      >
        {showDropdown && dropdownList()}
      </Animated.View>
    </>
  );
};
export default CustomNavigationDropdown;
