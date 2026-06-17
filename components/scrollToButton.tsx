import { View, TouchableOpacity } from "react-native";
import cn from "@/utility_functions/cn";
import Entypo from "@expo/vector-icons/Entypo";

interface Props {
  onPress: () => void;
  isHidden?: boolean;
}

const ScrollToButton = ({ onPress, isHidden = false }: Props) => {
  return (
    <View className="absolute bottom-4 left-0 right-0">
      <View className="flex flex-1 items-center">
        <TouchableOpacity
          onPress={onPress}
          className={cn(
            "flex rounded-full bg-highlight p-2",
            isHidden && "hidden",
          )}
        >
          <Entypo name="chevron-small-up" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ScrollToButton;
