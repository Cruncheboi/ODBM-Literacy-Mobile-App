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
        "min-h-20 py-5 flex items-start justify-center bg-odbm-light dark:bg-odbm-gray-digital",
        className
      )}
    >
      <Text
        className={cn(
          "text-3xl font-bold text-odbm-blue-600 dark:text-white",
          textStyles
        )}
      >
        {title}
      </Text>
    </View>
  );
};
export default CustomSectionHeader;
