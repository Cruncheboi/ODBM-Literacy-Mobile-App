import cn from "@/utility_functions/cn";
import { Text } from "react-native";

interface Props {
  label: string;
  className?: string;
}

const StyledLabel = ({ label, className }: Props) => {
  return (
    <Text className={cn("py-2 text-xl text-textColor-primary", className)}>
      {label}
    </Text>
  );
};
export default StyledLabel;
