import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "nativewind";
import { getThemeFontColor } from "@/utility_functions/themeColor";
import StyledLabel from "@/components/styledLabel";

export const TopBarNavigation = () => {
  const { colorScheme } = useColorScheme();
  const { dismiss } = useBottomSheetModal();
  return (
    <View className="min-h-14 flex-row items-center justify-start">
      <MaterialIcons
        name="close"
        size={35}
        color={getThemeFontColor(colorScheme)}
        onPress={() => dismiss()}
      />
      <View className="flex-1 items-center justify-center">
        <StyledLabel label="Your Selected Images" className="font-bold" />
      </View>
    </View>
  );
};
