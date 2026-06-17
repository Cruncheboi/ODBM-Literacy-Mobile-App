import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import cn from "@/utility_functions/cn";
interface Props {
  onPress: () => void;
  title: string;
  className?: string;
  disabled?: boolean;
  textStyles?: string;
}

const CustomOpacityButton = ({
  onPress,
  title,
  className,
  disabled = false,
  textStyles,
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={cn(
        "elevation-lg my-5 min-h-14 w-full rounded-full bg-highlight shadow-highlight",
        className,
        disabled && "opacity-50",
      )}
    >
      <View className="flex-1 items-center justify-center">
        <Text
          className={cn(
            "text-textColor-title text-xl font-semibold",
            textStyles,
          )}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default CustomOpacityButton;
