import {
  getPrimaryColor,
  getThemeFontColor,
  getThemeHighlightColor,
} from "@/utility_functions/themeColor";
import cn from "@/utility_functions/cn";
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
      className={cn(
        "min-h-14 flex-1 rounded-md bg-secondary p-2",
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
        selectionColor={getThemeHighlightColor(colorScheme)}
        maxLength={maxLen}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        selectTextOnFocus={false}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        className={cn("flex-1 text-textColor-body", inputClassName)}
        placeholder={placeholder}
        placeholderClassName="opacity-70"
        placeholderTextColor={getThemeFontColor(colorScheme)}
      />
      {children}
    </View>
  );
};
export default StyledTextInput;
