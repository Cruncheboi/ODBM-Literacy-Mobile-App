import { Stack } from "expo-router";
const Layout = () => {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="createPost" />
      <Stack.Screen name="viewPost" />
    </Stack>
  );
};
export default Layout;
