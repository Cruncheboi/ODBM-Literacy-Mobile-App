import { useColorScheme } from "nativewind";
import { View, Text, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Settings = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <View className="flex-1 flex justify-start items-center py-safe dark:bg-odbm-gray-digital">
      <View className="flex-row gap-5">
        <Text className="dark:text-white text-lg">Switch Default Theme</Text>
        <Switch
          value={colorScheme == "light"}
          onValueChange={toggleColorScheme}
        />
      </View>
    </View>
  );
};
export default Settings;
