import {
  getPrimaryColor,
  getThemeFontColor,
} from "@/utility_functions/themeColor";
import clsx from "clsx";
import { useColorScheme } from "nativewind";
import { View, TextInput } from "react-native";
import type {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputProps,
} from "react-native";

interface Props {
  children?: React.ReactNode;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  inputClassName?: string;
  containerClassName?: string;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: TextInputProps["autoComplete"];
  multiline?: boolean;
  maxLen?: number;
  value?: string;
  editable?: boolean;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
}

const StyledTextInput = ({
  children,
  placeholder,
  onChangeText,
  secureTextEntry = false,
  containerClassName,
  inputClassName,
  keyboardType,
  autoComplete,
  multiline = false,
  maxLen = 256,
  value,
  editable = true,
  onBlur,
  autoCapitalize,
}: Props) => {
  const { colorScheme } = useColorScheme();

  return (
    <View
      className={clsx(
        "p-2 bg-odbm-gray-light dark:bg-odbm-gray rounded-md flex-1 min-h-14",
        "flex-row",
        containerClassName,
      )}
    >
      <TextInput
        onBlur={onBlur}
        editable={editable}
        value={value}
        multiline={multiline}
        numberOfLines={13}
        textAlignVertical={multiline ? "top" : "center"}
        cursorColor={getThemeFontColor(colorScheme)}
        selectionColor={getPrimaryColor()}
        maxLength={maxLen}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        selectTextOnFocus={false}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        className={clsx(
          "color-odbm-gray dark:color-white flex-1",
          inputClassName,
        )}
        placeholder={placeholder}
        placeholderClassName="color-odbm-gray dark:color-white"
      />
      {children}
    </View>
  );
};
export default StyledTextInput;
