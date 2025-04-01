import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface Props {
  onPress: () => void;
  title: string;
  buttonStyles?: string;
}

const CustomOpacityButton = ({ onPress, title, buttonStyles }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-3/4 bg-highlight min-h-14 rounded-full my-5 shadow-[100px_100px_50px] shadow-highlight ${buttonStyles}`}
    >
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-xl font-semibold">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default CustomOpacityButton;
