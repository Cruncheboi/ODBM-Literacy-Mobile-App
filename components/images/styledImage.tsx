import { Image, ImageContentFit, ImageStyle } from "expo-image";
import { StyleProp } from "react-native";

interface StyledImageProps {
  uri: string;
  imageHash: string;
  style: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
}

const StyledImage = ({
  uri,
  imageHash,
  style,
  contentFit,
}: StyledImageProps) => {
  return (
    <Image
      source={{ uri }}
      style={style}
      contentFit={contentFit}
      cachePolicy="memory-disk"
      transition={300}
      recyclingKey={uri}
      placeholder={{ thumbhash: imageHash }}
      placeholderContentFit={contentFit}
    />
  );
};
export default StyledImage;
