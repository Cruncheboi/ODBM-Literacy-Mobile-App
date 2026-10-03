import { ScrollView, View } from "react-native";
import CustomHeader from "../customHeader";
import StyledLabel from "../styledLabel";
import StyledTextInput from "../styledTextInput";
import { TouchedFields } from "@/app/postActions/editTestimonyPost";
import ErrorText from "../errorText";
import { BODY_CHAR_LIMIT, TITLE_CHAR_LIMIT } from "@/definitions/posts";

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

interface BodyInputProps {
  body: string;
  setBody: (body: string) => void;
  isEditable: boolean;
  hasTouched: TouchedFields;
  onBlur: () => void; // sets fields that have been touched
  hasValidBody: boolean;
}

interface CharsRemainingDisplayProps {
  curLen: number;
  maxLen: number;
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
      <CharsRemainingDisplay
        curLen={title.trim().length}
        maxLen={TITLE_CHAR_LIMIT}
      />
      {hasTouched.title && !hasValidTitle && (
        <ErrorText>Your title cannot be empty.</ErrorText>
      )}
    </>
  );
};

export const StyledBodyInput = ({
  body,
  setBody,
  isEditable,
  onBlur,
  hasTouched,
  hasValidBody,
}: BodyInputProps) => {
  return (
    <>
      <View className="h-60">
        <StyledLabel label="Story" />
        <StyledTextInput
          placeholder="Enter your story here..."
          onChangeText={setBody}
          value={body}
          maxLen={BODY_CHAR_LIMIT}
          multiline={true}
          editable={isEditable}
          onBlur={onBlur}
          autoCapitalize="sentences"
        />
      </View>
      <CharsRemainingDisplay
        curLen={body.trim().length}
        maxLen={BODY_CHAR_LIMIT}
      />
      {hasTouched.body && !hasValidBody && (
        <ErrorText>Your post cannot be empty.</ErrorText>
      )}
    </>
  );
};

export const CharsRemainingDisplay = ({
  curLen,
  maxLen,
}: CharsRemainingDisplayProps) => {
  const remainingChars = maxLen - curLen;

  if (remainingChars === 0) {
    return (
      <ErrorText>
        Max length of {maxLen.toString()} characters reached.
      </ErrorText>
    );
  }

  return <StyledLabel label={`${remainingChars} characters remaining.`} />;
};
