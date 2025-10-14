import clsx from "clsx";
import { Text } from "react-native";

interface Props {
  children: string | string[];
  className?: string;
}

const InfoText = ({ children, className }: Props) => {
  return (
    <Text className={clsx("font-semibold py-1", className)}>{children}</Text>
  );
};
export default InfoText;
