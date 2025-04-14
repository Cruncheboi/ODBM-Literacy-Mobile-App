import { getThemeFontColor } from "@/utility_functions/themeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { View, Text, TouchableOpacity } from "react-native";
const CustomBackButton = () => {
  const { colorScheme } = useColorScheme();
  return (
    <View className="flex justify-center items-center">
      <TouchableOpacity
        onPressOut={() => {
          router.back();
        }}
      >
        <Ionicons
          name="arrow-back"
          size={32}
          color={getThemeFontColor(colorScheme)}
          className="pr-2"
        />
      </TouchableOpacity>
    </View>
  );
};
export default CustomBackButton;
