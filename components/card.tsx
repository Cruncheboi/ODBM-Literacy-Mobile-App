import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";
import { Testimony } from "@/firebaseConfig";

interface Props {
  testimony: Testimony;
}

const Card = ({ testimony }: Props) => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="w-11/12 self-center p-3 max-h-70 rounded-xl">
      <TouchableOpacity className="w-full">
        <Text className="text-odbm-gold">
          @{testimony.displayName}{" "}
          <Text className="dark:text-gray-300 text-odbm-blue-600">
            {testimony.date.toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Text>
        <Text className="dark:text-gray-300 text-xl font-semibold line-clamp-3">
          {testimony.title}
        </Text>
        <View className="max-h-40 my-4">
          <Text className="dark:text-gray-300 text-lg line-clamp-5">
            {testimony.body}
          </Text>
        </View>
        <TouchableOpacity className="w-full border-2 rounded-full border-odbm-blue-600 dark:border-gray-400 items-center py-2">
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color={colorScheme == "light" ? "#173A64" : "#d1d5db"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};
export default Card;
