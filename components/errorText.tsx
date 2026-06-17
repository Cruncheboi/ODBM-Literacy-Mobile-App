import cn from "@/utility_functions/cn";
import { Text } from "react-native";

interface Props {
  children: string | string[];
  className?: string;
  hasError?: boolean;
}

const ErrorText = ({ children, className, hasError = true }: Props) => {
  return (
    <Text
      className={cn(
        "py-1 font-semibold",
        hasError && "text-red-600",
        className,
      )}
    >
      {children}
    </Text>
  );
};
export default ErrorText;
