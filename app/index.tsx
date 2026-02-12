import { useAppSelector } from "@/redux/hooks";
import { router, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { Text, View, Image, TouchableHighlight } from "react-native";

export default function Index() {
  const isSignedIn = useAppSelector((state) => state.users.isSignedIn);
  const rootNavigationState = useRootNavigationState();
  const navigatorReady = rootNavigationState?.key;

  // Manage user route based on authentication status
  useEffect(() => {
    if (!navigatorReady) return;
    if (isSignedIn) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/signIn");
    }
  }, [navigatorReady]);

  return (
    <View className="flex-1 justify-around items-center bg-white dark:bg-odbm-gray-digital">
      {/* <StatusBar style="light"></StatusBar> */}
      <Image
        source={require("@/assets/images/our-daily-bread-logo.png")}
        // style={{ width: 150, height: 150 }}
        className="size-48"
        resizeMode="contain"
      />
      {/* <TouchableHighlight
        className="bg-highlight rounded-full p-5 w-3/4 flex items-center justify-center focus:bg-shadow min-h-[50px]"
        underlayColor="#ad7d1a"
        onPress={handlePress}
      >
        <Text className="text-xl text-white font-bold">Begin</Text>
      </TouchableHighlight> */}
    </View>
  );
}
