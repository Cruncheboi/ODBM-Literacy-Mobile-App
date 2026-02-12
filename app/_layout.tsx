import "@/global.css";
import { router, Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import getThemeMainColor, {
  getThemeFontColor,
  getThemeSecondaryColor,
} from "@/utility_functions/themeColor";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import store from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { auth, isSignedIn } from "@/firebaseConfig";
import { useAppDispatch } from "@/redux/hooks";
import Toast, { BaseToast, ToastProps } from "react-native-toast-message";
// import * as SystemUI from "expo-system-ui";

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

  const toastConfig = {
    success: (props: ToastProps) => {
      return (
        <BaseToast
          {...props}
          style={{ borderLeftColor: "green" }}
          contentContainerStyle={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderRightWidth: 1,
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
            borderColor: "#58595B",
            backgroundColor: getThemeSecondaryColor(colorScheme),
          }}
          text1Style={{ color: getThemeFontColor(colorScheme) }}
        />
      );
    },
    error: (props: ToastProps) => {
      return (
        <BaseToast
          {...props}
          style={{ borderLeftColor: "red" }}
          contentContainerStyle={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderRightWidth: 1,
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
            borderColor: "#58595B",
            backgroundColor: getThemeSecondaryColor(colorScheme),
          }}
          text1Style={{ color: getThemeFontColor(colorScheme) }}
        />
      );
    },
  };

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
    // (async () => {
    //   const color = await SystemUI.getBackgroundColorAsync();
    //   console.log(`ColorValue: ${color?.toString()}`);
    // })();

    return () => unsubscribe();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView>
            <SafeAreaProvider
            // className="color-black"
            // style={{
            //   backgroundColor: ,
            // }}
            >
              <StatusBar
                style="auto"
                backgroundColor={getThemeMainColor(colorScheme)}
              />
              <Stack
                screenOptions={{
                  // animation: "slide_from_right",
                  // presentation
                  // animationTypeForReplace: "pop",
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
                <Stack.Screen name="postActions" />
              </Stack>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
      <Toast position="bottom" config={toastConfig} />
    </>
  );
}
