import cn from "@/utility_functions/cn";
import { Text } from "react-native";

interface Props {
  children: string | string[];
  className?: string;
}

const InfoText = ({ children, className }: Props) => {
  return (
    <Text className={cn("py-1 font-semibold", className)}>{children}</Text>
  );
};
export default InfoText;
