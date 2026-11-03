import cn from "@/utility_functions/cn";
import { TouchableOpacity } from "react-native";

interface StyledButtonProps {
  onPress: () => void;
  label: React.JSX.Element;
  icon?: React.JSX.Element;
  className?: string;
  disabled?: boolean;
}

const StyledButton = ({
  onPress,
  icon,
  label,
  className,
  disabled = false,
}: StyledButtonProps) => {
  return (
    <TouchableOpacity
      className={cn(
        "flex w-full flex-row items-center justify-center rounded-md border border-gray-400 bg-bgColor-primary",
        disabled && "disabled:opacity-60",
        className,
      )}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      {label}
    </TouchableOpacity>
  );
};
export default StyledButton;
