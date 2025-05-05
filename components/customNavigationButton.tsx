import cn from "@/utility_functions/cn";
import { View, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { getThemeFontColor } from "@/utility_functions/themeColor";

interface Props {
  buttonTitle: string;
  /**
   * Title to show above the button. Defaults to "Continue"
   */
  floatingTitle?: string;
  /**
   * Defaults to false.
   */
  showFloatingTitle?: boolean;
  onPress: () => void;
}

/**
 * @returns A button styled for navigation.
 */
const CustomNavigationButton = ({
  buttonTitle,
  floatingTitle = "Continue",
  showFloatingTitle = false,
  onPress,
}: Props) => {
  const { colorScheme } = useColorScheme();

  const tapGesture = Gesture.Tap().runOnJS(true).onEnd(onPress);

  const translateY = useSharedValue(-25);

  useEffect(() => {
    const duration = 1000;
    translateY.value = withRepeat(
      withTiming(translateY.value + 10, { duration: duration }),
      -1,
      true
    );
  }, []);

  const smoothBounceStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <View className="w-28 h-28 bg-odbm-gold rounded-full flex items-center justify-center relative my-5">
        {/* <View className="w-full min-h-20 bg-odbm-gold rounded-full flex items-center justify-center relative"> */}
        <Text className="text-lg font-semibold text-white dark:text-odbm-gray-dark text-center ">
          {buttonTitle}
        </Text>
        {/* Floating title */}
        {showFloatingTitle && (
          <View
            className={cn(
              "absolute top-[50%] left-[50%] w-40 h-16 rounded-xl flex justify-center items-center bg-transparent",
              "-translate-x-[50%]",
              "-translate-y-[150%]"
            )}
          >
            <Animated.View
              className="flex items-center justify-center"
              style={smoothBounceStyles}
            >
              <Text className="text-white bg-[#0f0f0f99] p-2 rounded-xl font-semibold">
                {floatingTitle}
              </Text>
              <AntDesign
                name="down"
                size={24}
                color={getThemeFontColor(colorScheme)}
              />
            </Animated.View>
          </View>
        )}
      </View>
    </GestureDetector>
  );
};
export default CustomNavigationButton;
