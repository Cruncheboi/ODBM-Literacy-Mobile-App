import { Stack } from "expo-router";
import CustomBackButton from "@/components/customBackButton";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="pdfViewer"
        options={{
          headerLeft: () => <CustomBackButton />,
          headerTitle: "PDF Viewer",
        }}
      />
    </Stack>
  );
};
export default Layout;
