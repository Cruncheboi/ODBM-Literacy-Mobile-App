import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { View } from "react-native";

/**
 * Custom bottom sheet background for use with @package gorhom/bottom-sheet
 * @returns
 */
const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
  return <View className="bg-primary" style={style} />;
};
export default CustomBackground;
