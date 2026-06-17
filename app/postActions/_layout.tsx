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
      <Stack.Screen name="createReport" />
      <Stack.Screen name="viewPost" />
      <Stack.Screen name="viewReport" />
      <Stack.Screen name="editPost" />
    </Stack>
  );
};
export default Layout;
