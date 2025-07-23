import {
  getPrimaryColor,
  getThemeFontColor,
} from "@/utility_functions/themeColor";
import clsx from "clsx";
import { useColorScheme } from "nativewind";
import { View, TextInput } from "react-native";
import type { KeyboardTypeOptions, TextInputProps } from "react-native";

interface Props {
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  inputClassName?: string;
  containerClassName?: string;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: TextInputProps["autoComplete"];
}

interface AutoComplete {}

const StyledTextInput = ({
  placeholder,
  onChangeText,
  secureTextEntry = false,
  containerClassName,
  inputClassName,
  keyboardType,
  autoComplete,
}: Props) => {
  const { colorScheme } = useColorScheme();

  return (
    <View
      className={clsx(
        "p-2 bg-odbm-gray-light dark:bg-odbm-gray rounded-md flex-1 min-h-14",
        containerClassName
      )}
    >
      <TextInput
        cursorColor={getThemeFontColor(colorScheme)}
        selectionColor={getPrimaryColor()}
        maxLength={256}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoComplete={autoComplete}
        selectTextOnFocus={false}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        className={clsx(
          "color-odbm-gray dark:color-white flex-1",
          inputClassName
        )}
        placeholder={placeholder}
        placeholderClassName="color-odbm-gray dark:color-white"
      />
    </View>
  );
};
export default StyledTextInput;
