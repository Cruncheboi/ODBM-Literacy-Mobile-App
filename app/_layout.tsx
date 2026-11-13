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
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ToastContainer } from "@ncrft/native-toast";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
// import * as SystemUI from "expo-system-ui";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";

cssInterop(Image, {
  className: "style",
});

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

  // THEMES
  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#222222", // Match your dark grey background
      card: "#0f0f0f", // Match your tab bar background
    },
  };
  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "##f5f5f5", // Match your dark grey background
      card: "#f5f5f5", // Match your tab bar background
    },
  };
  const currentTheme = colorScheme === "dark" ? darkTheme : lightTheme;

  // const toastConfig = {
  //   success: (props: ToastProps) => {
  //     return (
  //       <BaseToast
  //         {...props}
  //         style={{ borderLeftColor: "green" }}
  //         contentContainerStyle={{
  //           borderTopWidth: 1,
  //           borderBottomWidth: 1,
  //           borderRightWidth: 1,
  //           borderTopRightRadius: 6,
  //           borderBottomRightRadius: 6,
  //           borderColor: "#58595B",
  //           backgroundColor: getThemeSecondaryColor(colorScheme),
  //         }}
  //         text1Style={{ color: getThemeFontColor(colorScheme) }}
  //       />
  //     );
  //   },
  //   info: (props: ToastProps) => {
  //     return (
  //       <BaseToast
  //         {...props}
  //         style={{ borderLeftColor: "yellow" }}
  //         contentContainerStyle={{
  //           borderTopWidth: 1,
  //           borderBottomWidth: 1,
  //           borderRightWidth: 1,
  //           borderTopRightRadius: 6,
  //           borderBottomRightRadius: 6,
  //           borderColor: "#58595B",
  //           backgroundColor: getThemeSecondaryColor(colorScheme),
  //         }}
  //         text1Style={{ color: getThemeFontColor(colorScheme) }}
  //       />
  //     );
  //   },
  //   error: (props: ToastProps) => {
  //     return (
  //       <BaseToast
  //         {...props}
  //         style={{ borderLeftColor: "red" }}
  //         contentContainerStyle={{
  //           borderTopWidth: 1,
  //           borderBottomWidth: 1,
  //           borderRightWidth: 1,
  //           borderTopRightRadius: 6,
  //           borderBottomRightRadius: 6,
  //           borderColor: "#58595B",
  //           backgroundColor: getThemeSecondaryColor(colorScheme),
  //         }}
  //         text1Style={{ color: getThemeFontColor(colorScheme) }}
  //         activeOpacity={8000}
  //       />
  //     );
  //   },
  // };

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
            <BottomSheetModalProvider>
              <SafeAreaProvider
              // className="color-black"
              // style={{
              //   backgroundColor: ,
              // }}
              >
                <StatusBar style="auto" />
                <ThemeProvider value={currentTheme}>
                  <Stack
                    screenOptions={{
                      animation: "fade",
                      // presentation: "fullScreenModal",
                      // animationTypeForReplace: "pop",
                      // navigationBarColor: getThemeMainColor(colorScheme),
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
                </ThemeProvider>
                <ToastContainer theme={colorScheme ?? "dark"} />
              </SafeAreaProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </>
  );
}
