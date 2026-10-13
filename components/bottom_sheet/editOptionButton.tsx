import { View } from "react-native";
import StyledButton from "../styledButton";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getThemeFontColor } from "@/utility_functions/themeColor";
import { useColorScheme } from "nativewind";
import StyledLabel from "../styledLabel";

export interface EditOptionProps {
  onEditPress: () => void;
}

const EditOptionButton = ({ onEditPress }: EditOptionProps) => {
  const { colorScheme } = useColorScheme();

  return (
    <StyledButton
      icon={
        <View className="pr-4">
          <FontAwesome5
            name="edit"
            size={24}
            color={getThemeFontColor(colorScheme)}
          />
        </View>
      }
      label={<StyledLabel label="Edit" />}
      onPress={onEditPress}
    />
  );
};
export default EditOptionButton;
