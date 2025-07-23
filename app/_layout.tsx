import "@/global.css";
import { router, Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import getThemeMainColor from "@/utility_functions/themeColor";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import store from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { auth, isSignedIn } from "@/firebaseConfig";
import { useAppDispatch } from "@/redux/hooks";

const persistor = persistStore(store);

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/(tabs)/home");
        console.log("redirecting to home...");
      } else {
        router.replace("/(auth)/signIn");
        console.log("redirecting to sign in...");
      }
    });
    return () => unsubscribe();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView>
          <SafeAreaProvider
            style={{
              backgroundColor: colorScheme == "light" ? "#f5f5f5" : "#222222",
            }}
          >
            <StatusBar
              style="auto"
              backgroundColor={getThemeMainColor(colorScheme)}
            />
            <Stack
              screenOptions={{
                animation: "ios_from_right",
                animationTypeForReplace: "push",
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
              <Stack.Screen name="(auth)" />
            </Stack>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
