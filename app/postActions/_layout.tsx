import { Stack } from "expo-router";
const Layout = () => {
  return (
    <Stack
      initialRouteName="createPost"
      screenOptions={{
        headerShown: false,
        statusBarBackgroundColor: "transparent",
      }}
    >
      <Stack.Screen name="createPost" />
      <Stack.Screen name="createComment" />
      <Stack.Screen name="viewPost" />
    </Stack>
  );
};
export default Layout;
