import { Image } from "react-native";
import type { GestureViewerRenderItemInfo } from "react-native-gesture-image-viewer";

interface StyledImageProps {
  url: string;
  itemInfo?: GestureViewerRenderItemInfo;
}

const StyledImage = ({ url, itemInfo }: StyledImageProps) => {
  return (
    <Image
      className="h-full w-full border"
      source={{ uri: url }}
      resizeMode="contain"
      onLoad={({ nativeEvent }) => {
        if (!itemInfo) return;
        const { setItemDimensions } = itemInfo;
        console.log(
          `width: ${nativeEvent.source.width}, height: ${nativeEvent.source.height}`,
        );
        setItemDimensions({
          width: nativeEvent.source.width,
          height: nativeEvent.source.height,
        });
      }}
    />
  );
};
export default StyledImage;
