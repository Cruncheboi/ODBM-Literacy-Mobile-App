import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";
import getThemeMainColor from "@/utility_functions/themeColor";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  // useEffect(() => {
  //   async () => {
  //     const color = await NavigationBar.getBackgroundColorAsync();
  //     console.log(color);
  //   };
  // }, []);

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "#FAB432",
        tabBarInactiveTintColor: colorScheme == "dark" ? "white" : "gray",
        // tabBarBackground: () => (
        //   <View className="flex-1 elevation-lg dark:bg-black"></View>
        // ),
        tabBarInactiveBackgroundColor: getThemeMainColor(colorScheme),
        tabBarActiveBackgroundColor: getThemeMainColor(colorScheme),
        headerShown: false,
      }}
      backBehavior="initialRoute"
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="home" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="learners"
        options={{
          title: "Learners",
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="book-open" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="facillitators"
        options={{
          title: "Facillitators",
          tabBarIcon: ({ color, size }) => {
            return (
              <FontAwesome6 name="people-line" size={size} color={color} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons name="settings-outline" size={size} color={color} />
            );
          },
        }}
      />
    </Tabs>
  );
}
