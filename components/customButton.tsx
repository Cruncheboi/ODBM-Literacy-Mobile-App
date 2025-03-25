import { View, Text, TouchableHighlight } from "react-native";

interface Props {
  title: string;
  underlayColor?: string;
  textClassName?: string;
  onPress: () => void;
}

const CustomButton = ({
  title,
  onPress,
  underlayColor,
  textClassName,
}: Props) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      className="bg-secondary min-h-14 color-secondary"
      underlayColor="#d46124"
    >
      <View className=" bg-secondary">
        <Text className={`text-xl ${textClassName}`}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};
export default CustomButton;
