import { Stack } from "expo-router";
import { View, Text } from "react-native";
const Layout = () => {
  return (
    <Stack
      initialRouteName="register"
      screenOptions={{
        headerShown: false,
        statusBarBackgroundColor: "transparent",
        animation: "ios_from_right",
      }}
    >
      <Stack.Screen name="register" />
      <Stack.Screen name="signIn" />
    </Stack>
  );
};
export default Layout;
