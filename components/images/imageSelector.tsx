import { pickAndCompressImages } from "@/utility_functions/images/pickAndCompress";
import StyledButton from "../styledButton";
import StyledLabel from "../styledLabel";
import { CompressedImagePayload } from "@/definitions/media";

interface ImageSelectorProps {
  images: CompressedImagePayload[];
  setImages: (newImages: CompressedImagePayload[]) => void;
}

const ImageSelector = ({ images, setImages }: ImageSelectorProps) => {
  const onImageSelectPressed = async () => {
    const newImages = await pickAndCompressImages();
    setImages(newImages);
  };

  return (
    <StyledButton
      label={<StyledLabel label="Pick Images" />}
      onPress={onImageSelectPressed}
    />
  );
};
export default ImageSelector;
