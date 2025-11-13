import { View, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import StyledTextInput from "./styledTextInput";

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

  return (
    <View className=" bg-odbm-gray-light dark:bg-odbm-gray rounded-md flex flex-row items-center">
      <StyledTextInput
        placeholder={placeholder}
        secureTextEntry={hideText}
        onChangeText={onChangeText}
        value={value}
        editable={editable}
      />
      <TouchableOpacity
        onPress={() => setHideText((state) => !state)}
        className="pr-2 ml-2"
      >
        {hideText ? (
          <FontAwesome5 name="eye" size={28} color="black" />
        ) : (
          <FontAwesome5 name="eye-slash" size={28} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
};
export default SecureTextInput;
