import cn from "@/utility_functions/cn";
import { Text } from "react-native";

interface Props {
  label: string;
  className?: string;
}

const StyledLabel = ({ label, className }: Props) => {
  return (
    <Text
      className={cn("color-odbm-gray dark:color-white py-2 text-xl", className)}
    >
      {label}
    </Text>
  );
};
export default StyledLabel;
