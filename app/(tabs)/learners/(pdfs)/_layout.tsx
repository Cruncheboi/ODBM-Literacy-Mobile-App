import { router, Stack } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="pdfViewer"
        options={{
          headerLeft: () => {
            return (
              <View className="flex justify-center items-center">
                <TouchableOpacity
                  onPressOut={() => {
                    router.back();
                  }}
                >
                  <Ionicons
                    name="arrow-back"
                    size={32}
                    color="white"
                    className="pr-2"
                  />
                </TouchableOpacity>
              </View>
            );
          },
          headerTitle: "PDF Viewer",
        }}
      />
    </Stack>
  );
};
export default Layout;
