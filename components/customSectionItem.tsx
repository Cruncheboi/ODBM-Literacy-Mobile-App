import {
  BaseButton,
  Gesture,
  GestureDetector,
  Pressable,
  RectButton,
  TouchableOpacity,
} from "react-native-gesture-handler";
import React from "react";
import cn from "@/utility_functions/cn";
import { Text, View } from "react-native";
// import { StyleSheet } from "";
interface Props {
  onPress: () => void;
  title: string;
  className?: string;
  disabled?: boolean;
  textStyles?: string;
}

const CustomSectionItem = ({
  onPress,
  title,
  className,
  disabled = false,
  textStyles,
}: Props) => {
  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .runOnJS(true)
    .onStart(disabled ? () => {} : onPress);
  return (
    <GestureDetector gesture={singleTap}>
      <View
        className={cn(
          "border-borderColor-primary min-h-11 w-full rounded-xl border bg-bgColor-primary px-7 py-2 active:opacity-50",
          className,
          disabled && "opacity-50",
        )}
        collapsable={false}
      >
        <Text className={cn("text-xl text-textColor-primary", textStyles)}>
          {title}
        </Text>
      </View>
    </GestureDetector>
  );
};
export default CustomSectionItem;
