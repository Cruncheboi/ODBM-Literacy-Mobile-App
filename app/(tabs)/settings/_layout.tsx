import { Stack } from "expo-router";
const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="(userInfo)/profile" />
      <Stack.Screen name="(userInfo)/userPosts" />
      <Stack.Screen name="(admin)/reports" />
    </Stack>
  );
};
export default Layout;
