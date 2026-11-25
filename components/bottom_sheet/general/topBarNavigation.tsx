import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "nativewind";
import { getThemeFontColor } from "@/utility_functions/themeColor";
import StyledLabel from "@/components/styledLabel";
import clsx from "clsx";

interface TopBarNavigationProps {
  onRestorePressed: () => void;
  disabled?: boolean;
}

export const TopBarNavigation = ({
  onRestorePressed,
  disabled = false,
}: TopBarNavigationProps) => {
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
      <MaterialIcons
        name="restore"
        size={30}
        color={getThemeFontColor(colorScheme)}
        onPress={onRestorePressed}
        disabled={disabled}
        className={clsx(disabled && "opacity-65")}
      />
    </View>
  );
};
