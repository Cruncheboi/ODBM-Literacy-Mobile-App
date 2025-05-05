import cn from "@/utility_functions/cn";
import { View } from "react-native";

interface Props {
  className?: string;
}

const CustomSectionSeparator = ({ className }: Props) => {
  return (
    <View
      className={cn(
        "w-full h-[1px] bg-odbm-blue-300 dark:bg-zinc-300 my-3 rounded-full",
        className
      )}
    />
  );
};
export default CustomSectionSeparator;
