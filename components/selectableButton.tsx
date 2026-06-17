import { getThemeFontColor } from "@/utility_functions/themeColor";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "nativewind";
import { PropsWithChildren, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export interface SelectableButtonProps extends PropsWithChildren {
  isSelected: boolean;
  handleSelectAction: () => void;
}

const SelectableButton = ({
  isSelected,
  handleSelectAction,
  children,
}: SelectableButtonProps) => {
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity onPress={handleSelectAction}>
      <View className="h-14 flex-row items-center justify-start">
        <View className="flex">
          {isSelected && (
            <MaterialIcons
              name="radio-button-on"
              size={24}
              color={getThemeFontColor(colorScheme)}
            />
          )}
          {!isSelected && (
            <MaterialIcons
              name="radio-button-off"
              size={24}
              color={getThemeFontColor(colorScheme)}
            />
          )}
        </View>
        <View className="flex-1 px-2">{children}</View>
      </View>
    </TouchableOpacity>
  );
};
export default SelectableButton;
