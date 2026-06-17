import cn from "@/utility_functions/cn";
import { View, Text } from "react-native";

interface Props {
  title: string;
  className?: string;
  textStyles?: string;
}

const CustomSectionHeader = ({ title, className, textStyles }: Props) => {
  return (
    <View
      className={cn(
        "flex min-h-20 items-start justify-center bg-primary py-5",
        className,
      )}
    >
      <Text
        className={cn("text-textColor-primary text-2xl font-bold", textStyles)}
      >
        {title}
      </Text>
    </View>
  );
};
export default CustomSectionHeader;
