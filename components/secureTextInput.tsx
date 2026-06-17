import { View, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import StyledTextInput from "./styledTextInput";
import { getThemeHighlightColor } from "@/utility_functions/themeColor";
import { colorScheme, useColorScheme } from "nativewind";

interface Props {
  /**
   * @param secureText State from parent to change secureText
   */
  onChangeText: (secureText: string) => void;
  placeholder?: string;
  value?: string;
  editable?: boolean;
}

const SecureTextInput = ({
  onChangeText,
  placeholder,
  value,
  editable = true,
}: Props) => {
  const [hideText, setHideText] = useState(true);
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex flex-row items-center rounded-md bg-secondary">
      <StyledTextInput
        placeholder={placeholder}
        secureTextEntry={hideText}
        onChangeText={onChangeText}
        value={value}
        editable={editable}
      />
      <TouchableOpacity
        onPress={() => setHideText((state) => !state)}
        className="ml-2 pr-2"
      >
        {hideText ? (
          <FontAwesome5
            name="eye"
            size={28}
            color={getThemeHighlightColor(colorScheme)}
          />
        ) : (
          <FontAwesome5
            name="eye-slash"
            size={28}
            color={getThemeHighlightColor(colorScheme)}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
export default SecureTextInput;
