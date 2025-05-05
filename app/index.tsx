import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View, Image, TouchableHighlight } from "react-native";

export default function Index() {
  const handlePress = async () => {
    router.replace("/(tabs)/home");
  };

  return (
    <View className="flex-1 justify-around items-center bg-white">
      {/* <StatusBar style="light"></StatusBar> */}
      <Image
        source={require("@/assets/images/our-daily-bread-logo.png")}
        // style={{ width: 150, height: 150 }}
        className="size-48"
        resizeMode="contain"
      />
      <TouchableHighlight
        className="bg-highlight rounded-full p-5 w-3/4 flex items-center justify-center focus:bg-shadow min-h-[50px]"
        underlayColor="#ad7d1a"
        onPress={handlePress}
      >
        <Text className="text-xl text-white font-bold">Begin</Text>
      </TouchableHighlight>
    </View>
  );
}
