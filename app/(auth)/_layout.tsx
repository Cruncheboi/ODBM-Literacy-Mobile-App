import { Stack } from "expo-router";
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
