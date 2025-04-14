import "@/global.css";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import getThemeMainColor from "@/utility_functions/themeColor";

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
    <>
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
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
