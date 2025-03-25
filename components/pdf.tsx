import { View, Text, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

interface Props {
  source: { uri: string };
}

const Pdf = ({ source }: Props) => {
  // const source = {
  //   uri: "https://drive.google.com/file/d/1JTSBP7gx3Vk1UvMJc7-mDOxPmQKkVwmI/view?usp=drive_link",
  // };
  return (
    <View className="flex-1 justify-center place-items-center">
      {/* <Stack.Screen options={{ title: "Index", headerShown: true }} /> */}
      <WebView
        className="flex-1"
        source={source}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        renderLoading={() => (
          <View className="flex-1">
            <ActivityIndicator size="large" />
          </View>
        )}
        onFileDownload={() => {
          console.log("Downloaded");
        }}
      />
    </View>
  );
};
export default Pdf;
