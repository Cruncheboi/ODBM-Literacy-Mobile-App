import cn from "@/utility_functions/cn";
import { Text } from "react-native";

interface Props {
  label: string;
  className?: string;
  children?: React.ReactElement<Props> | React.ReactElement<Props>[];
}

const StyledLabel = ({ label, className, children }: Props) => {
  return (
    <Text className={cn("py-2 text-xl text-textColor-primary", className)}>
      {label}
      {children}
    </Text>
  );
};
export default StyledLabel;
