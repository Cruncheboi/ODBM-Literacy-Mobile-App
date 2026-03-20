import { Tabs } from "expo-router";

const Layout = () => {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarStyle: { display: "none" },
        headerShown: false,
      }}
      backBehavior="initialRoute"
      tabBar={undefined}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};
export default Layout;
