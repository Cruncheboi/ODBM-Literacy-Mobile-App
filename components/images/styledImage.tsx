import { Image } from "react-native";

interface StyledImageProps {
  url: string;
}

const StyledImage = ({ url }: StyledImageProps) => {
  return (
    <Image
      className="m-3 aspect-square h-80 rounded-lg"
      source={{ uri: url }}
      resizeMode="cover"
    />
  );
};
export default StyledImage;
