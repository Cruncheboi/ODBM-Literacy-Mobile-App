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
  multiline?: boolean;
  maxLen?: number;
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
  multiline = false,
  maxLen = 256,
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
        multiline={multiline}
        numberOfLines={13}
        cursorColor={getThemeFontColor(colorScheme)}
        selectionColor={getPrimaryColor()}
        maxLength={maxLen}
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
