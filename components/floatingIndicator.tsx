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
import { PropsWithChildren, useEffect } from "react";
import { useColorScheme } from "nativewind";
import { getThemeFontColor } from "@/utility_functions/themeColor";

interface Props {
  floatingTitle?: string;
  showFloatingTitle?: boolean;
}

/**
 * @returns A button styled for navigation.
 */
const FloatingIndicator: React.FC<PropsWithChildren<Props>> = ({
  floatingTitle = "Continue",
  showFloatingTitle = false,
  children,
}) => {
  const { colorScheme } = useColorScheme();

  const translateY = useSharedValue(-25);

  useEffect(() => {
    const duration = 1000;
    translateY.value = withRepeat(
      withTiming(translateY.value + 10, { duration: duration }),
      -1,
      true,
    );
  }, []);

  const smoothBounceStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View className="relative flex items-center justify-center bg-transparent">
      {children}
      {showFloatingTitle && (
        // Floating title
        <View
          className={cn(
            "absolute left-[80%] top-[50%] flex h-16 w-40 items-center justify-center rounded-xl bg-transparent",
            "-translate-x-[50%]",
            "-translate-y-[115%]",
          )}
        >
          <Animated.View
            className="flex items-center justify-center"
            style={smoothBounceStyles}
          >
            <Text className="rounded-xl bg-[#0f0f0f99] p-2 font-semibold text-white">
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
  );
};
export default FloatingIndicator;
