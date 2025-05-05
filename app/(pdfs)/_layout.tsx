import { Stack } from "expo-router";
import CustomBackButton from "@/components/customBackButton";
import getThemeMainColor, {
  getThemeFontColor,
} from "@/utility_functions/themeColor";
import { useColorScheme } from "nativewind";

const Layout = () => {
  const { colorScheme } = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="pdfViewer"
        options={{
          headerLeft: () => <CustomBackButton />,
          headerTitle: "PDF Viewer",
          headerStyle: {
            backgroundColor: getThemeMainColor(colorScheme),
          },
          headerTintColor: getThemeFontColor(colorScheme),
        }}
      />
    </Stack>
  );
};
export default Layout;
