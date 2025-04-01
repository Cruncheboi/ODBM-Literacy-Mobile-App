import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Home = () => {
  return (
    <SafeAreaView>
      <View className="flex-1">
        <Text className="text-white">Home</Text>
      </View>
    </SafeAreaView>
  );
};
export default Home;
