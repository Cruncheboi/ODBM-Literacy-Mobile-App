import { Stack } from "expo-router";
import { View, Text } from "react-native";
const Layout = () => {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
};
export default Layout;
