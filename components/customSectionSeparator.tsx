import cn from "@/utility_functions/cn";
import { View } from "react-native";

interface Props {
  className?: string;
}

const CustomSectionSeparator = ({ className }: Props) => {
  return (
    <View
      className={cn(
        "my-3 h-[1px] w-full rounded-full bg-odbm-blue-600 dark:bg-zinc-300",
        className,
      )}
    />
  );
};
export default CustomSectionSeparator;
