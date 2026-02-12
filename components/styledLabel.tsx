import cn from "@/utility_functions/cn";
import { Text } from "react-native";

interface Props {
  label: string;
  textSize?: string;
}

const StyledLabel = ({ label, textSize }: Props) => {
  return (
    <Text
      className={cn(
        "color-odbm-gray dark:color-white py-2 ",
        textSize ? textSize : "text-xl"
      )}
    >
      {label}
    </Text>
  );
};
export default StyledLabel;
