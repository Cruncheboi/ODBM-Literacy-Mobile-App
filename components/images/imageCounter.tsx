import { View, Text } from "react-native";
import StyledLabel from "../styledLabel";
import clsx from "clsx";

interface ImageCounterProps {
  selectedIndex: number;
  totalCount: number;
  className?: string;
}

const ImageCounter = ({
  selectedIndex,
  totalCount,
  className,
}: ImageCounterProps) => {
  return (
    <View
      className={clsx(
        "absolute right-5 top-5 z-10 items-center justify-center rounded-full bg-black/65 px-3",
        className,
      )}
      pointerEvents="none"
    >
      <StyledLabel label={`${selectedIndex + 1} / ${totalCount}`} />
    </View>
  );
};
export default ImageCounter;
