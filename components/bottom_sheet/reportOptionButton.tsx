import { View } from "react-native";
import StyledButton from "../styledButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getThemeFontColor } from "@/utility_functions/themeColor";
import StyledLabel from "../styledLabel";
import { useColorScheme } from "nativewind";

export interface ReportOptionProps {
  onReportPress: () => void;
}

const ReportOptionButton = ({ onReportPress }: ReportOptionProps) => {
  const { colorScheme } = useColorScheme();
  return (
    <StyledButton
      icon={
        <View className="pr-4">
          <MaterialIcons
            name="report"
            size={28}
            color={getThemeFontColor(colorScheme)}
          />
        </View>
      }
      label={<StyledLabel label="Report Content" />}
      onPress={onReportPress}
    />
  );
};
export default ReportOptionButton;
