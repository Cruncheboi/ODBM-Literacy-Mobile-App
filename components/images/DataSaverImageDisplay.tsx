import { ImageInfo } from "@/definitions/media";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import StyledImage from "./styledImage";
import { View } from "react-native";

interface DataSaverImageDisplayProps {
  images: ImageInfo[];
}

const DataSaverImageDisplay = ({ images }: DataSaverImageDisplayProps) => {
  const renderListItem = ({ item }: ListRenderItemInfo<ImageInfo>) => {
    return <StyledImage url={item.url} />;
  };

  return (
    <View className="bg-bgColor-spotlight h-[21.5rem] w-full rounded-lg border-2 border-borderColor-primary"></View>
  );
};
export default DataSaverImageDisplay;
