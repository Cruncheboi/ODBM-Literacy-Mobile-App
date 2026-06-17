import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="passageViewer" />
      <Stack.Screen name="results" options={{ headerShown: false }} />
    </Stack>
  );
};
export default Layout;
