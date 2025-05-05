import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

const Index = () => {
  return (
    <View className="flex-1">
      <Svg>
        <Circle cx="50" cy="50" r="45" stroke="blue" fill="green" />
      </Svg>
    </View>
  );
};
export default Index;
