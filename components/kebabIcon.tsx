import { getThemeFontColor } from "@/utility_functions/themeColor";
import Entypo from "@expo/vector-icons/Entypo";
import { useColorScheme } from "nativewind";
import { TouchableOpacity } from "react-native";

interface KebabIconProps {
  className?: string;
  onPress: () => void;
}

const KebabIcon = ({ className, onPress }: KebabIconProps) => {
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity className={className} onPress={onPress}>
      <Entypo
        name="dots-three-vertical"
        size={24}
        color={getThemeFontColor(colorScheme)}
      />
    </TouchableOpacity>
  );
};
export default KebabIcon;
