import { Stack, useNavigation } from "expo-router";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import React from "react";
import "@/global.css";
const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} collapsableChildren={false}>
      <Drawer
        screenOptions={{
          drawerType: "slide",
          drawerActiveBackgroundColor: "var(--highlight)",
          drawerActiveTintColor: "white",
        }}
        initialRouteName="index"
        backBehavior="history"
      >
        <Drawer.Screen
          name="index"
          options={{
            headerTitle: "Getting Started",
            drawerLabel: "Getting Started",
          }}
        />
        <Drawer.Screen
          name="vocabPage"
          options={{ headerTitle: "Vocabulary", drawerLabel: "Vocabulary" }}
        />
        <Drawer.Screen
          name="fragments"
          options={{ headerTitle: "Fragments", drawerLabel: "Fragments" }}
        />
        <Drawer.Screen
          name="sentences"
          options={{ headerTitle: "Sentences", drawerLabel: "Sentences" }}
        />
        <Drawer.Screen
          name="openBibleStories"
          options={{
            headerTitle: "Open Bible Stories",
            drawerLabel: "Open Bible Stories",
          }}
        />
        <Drawer.Screen
          name="devotionals"
          options={{
            headerTitle: "Devotionals",
            drawerLabel: "Devotionals",
          }}
        />
        <Drawer.Screen
          name="childrenBible"
          options={{
            headerTitle: "Children's Bible",
            drawerLabel: "Children's Bible",
          }}
        />
        <Drawer.Screen
          name="bible"
          options={{
            headerTitle: "Bible",
            drawerLabel: "Bible",
          }}
        />
        <Drawer.Screen
          name="odbUniversity"
          options={{
            headerShown: false,
            drawerLabel: "ODB University",
          }}
        />
        <Drawer.Screen
          name="(pdfs)"
          options={{
            headerShown: false,
            drawerItemStyle: { display: "none" },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};
export default Layout;
