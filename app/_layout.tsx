import "@/global.css";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import getThemeMainColor from "@/utility_functions/themeColor";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [loaded, error] = useFonts({
    "Bounded Black": require("@/assets/fonts/Bounded Black.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <StatusBar
          style="auto"
          backgroundColor={getThemeMainColor(colorScheme)}
        />

        <Stack
          screenOptions={{
            animation: "fade_from_bottom",
            navigationBarColor: getThemeMainColor(colorScheme),
            statusBarBackgroundColor: "transparent",
            statusBarStyle: colorScheme == "light" ? "dark" : "light",
            headerShown: false,
          }}
          initialRouteName="index"
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(pdfs)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
