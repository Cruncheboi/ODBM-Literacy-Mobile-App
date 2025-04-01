import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

export interface Props {
  source: { uri: string };
}

const Pdf = React.memo(({ source }: Props) => {
  return (
    <View className="flex-1 justify-center place-items-center">
      <WebView
        setBuiltInZoomControls={false}
        className="flex-1"
        source={source}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        renderLoading={() => (
          <View className="flex-1">
            <ActivityIndicator size="large" />
          </View>
        )}
        cacheEnabled
      />
    </View>
  );
});
export default Pdf;
