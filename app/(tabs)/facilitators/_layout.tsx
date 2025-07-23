import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        statusBarBackgroundColor: "transparent",
        animation: "ios_from_right",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};
export default Layout;
