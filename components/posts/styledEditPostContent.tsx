import { ScrollView, View } from "react-native";
import CustomHeader from "../customHeader";
import StyledLabel from "../styledLabel";
import StyledTextInput from "../styledTextInput";
import { TouchedFields } from "@/app/postActions/editTestimonyPost";
import ErrorText from "../errorText";
import { TITLE_CHAR_LIMIT } from "@/definitions/posts";

interface EditPostProps {
  children: React.ReactNode;
}

interface TitleInputProps {
  title: string;
  setTitle: (title: string) => void;
  isEditable: boolean;
  hasTouched: TouchedFields;
  onBlur: () => void; // sets fields that have been touched
  hasValidTitle: boolean;
}

// A wrapper for edit-post content
const StyledEditPostBackground = ({ children }: EditPostProps) => {
  return (
    <CustomHeader title="Edit Your Post">
      <ScrollView
        className="flex w-full px-3 pb-3"
        contentContainerClassName="gap-3"
      >
        {children}
      </ScrollView>
    </CustomHeader>
  );
};
export default StyledEditPostBackground;

export const StyledTitleInput = ({
  title,
  setTitle,
  isEditable,
  onBlur,
  hasTouched,
  hasValidTitle,
}: TitleInputProps) => {
  return (
    <>
      <View className="h-32">
        <StyledLabel label="Title" />
        <StyledTextInput
          placeholder="Enter a title"
          onChangeText={setTitle}
          value={title}
          maxLen={TITLE_CHAR_LIMIT}
          multiline={true}
          editable={isEditable}
          onBlur={onBlur}
          autoCapitalize="sentences"
        />
      </View>
      {hasTouched.title && !hasValidTitle && (
        <ErrorText>Your title cannot be empty.</ErrorText>
      )}
      {title.length >= TITLE_CHAR_LIMIT && (
        <ErrorText>
          Max length of {TITLE_CHAR_LIMIT.toString()} characters reached.
        </ErrorText>
      )}
    </>
  );
};
