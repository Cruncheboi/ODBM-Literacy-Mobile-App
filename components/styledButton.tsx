import cn from "@/utility_functions/cn";
import { TouchableOpacity } from "react-native";

interface StyledButtonProps {
  onPress: () => void;
  label: React.JSX.Element;
  icon?: React.JSX.Element;
  className?: string;
}

const StyledButton = ({
  onPress,
  icon,
  label,
  className,
}: StyledButtonProps) => {
  return (
    <TouchableOpacity
      className={cn(
        "flex flex-row w-full justify-center items-center dark:bg-odbm-gray-dark border rounded-md dark:border-odbm-gray-dark",
        className,
      )}
      onPress={onPress}
    >
      {icon}
      {label}
    </TouchableOpacity>
  );
};
export default StyledButton;
