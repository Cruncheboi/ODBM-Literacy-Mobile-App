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
        "w-3/4 bg-highlight min-h-14 rounded-full my-5 elevation-lg shadow-highlight",
        className,
        disabled && "opacity-50"
      )}
    >
      <View className="flex-1 justify-center items-center">
        <Text
          className={cn("dark:text-white text-xl font-semibold", textStyles)}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default CustomOpacityButton;
