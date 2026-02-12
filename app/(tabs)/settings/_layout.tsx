import { Stack } from "expo-router";
import { View, Text } from "react-native";
const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="(userInfo)/profile" />
      <Stack.Screen name="(userInfo)/userPosts" />
    </Stack>
  );
};
export default Layout;
