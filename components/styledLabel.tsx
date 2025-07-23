import { Text } from "react-native";

interface Props {
  label: string;
}

const StyledLabel = ({ label }: Props) => {
  return (
    <Text className="color-odbm-gray dark:color-white py-2 text-xl">
      {label}
    </Text>
  );
};
export default StyledLabel;
