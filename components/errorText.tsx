import clsx from "clsx";
import { Text } from "react-native";

interface Props {
  children: string | string[];
  className?: string;
  hasError?: boolean;
}

const ErrorText = ({ children, className, hasError = true }: Props) => {
  return (
    <Text
      className={clsx(
        "font-semibold py-1",
        hasError && "text-red-600",
        className
      )}
    >
      {children}
    </Text>
  );
};
export default ErrorText;
