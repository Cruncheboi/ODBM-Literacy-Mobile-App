import { ImageInfo } from "@/definitions/media";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import StyledImage from "./styledImage";
import { View } from "react-native";

interface ImageDisplayProps {
  images: ImageInfo[];
}

const ImageDisplay = ({ images }: ImageDisplayProps) => {
  const renderListItem = ({ item }: ListRenderItemInfo<ImageInfo>) => {
    return <StyledImage url={item.url} />;
  };

  return (
    <View className="">
      <FlashList
        contentContainerClassName="h-[21.5rem]"
        className="bg-bgColor-spotlight w-full rounded-lg border-2 border-borderColor-primary"
        horizontal
        data={images}
        renderItem={renderListItem}
        estimatedItemSize={344}
      />
    </View>
  );
};
export default ImageDisplay;
