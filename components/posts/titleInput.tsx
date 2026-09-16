import { View, Text } from 'react-native'
import StyledLabel from '../styledLabel'
import StyledTextInput from '../styledTextInput'
import React from 'react';

interface TitleInputProps {
  title: string;
  setTitle: (title:string) => void;
  titleCharLimit: number;
  isEditable: boolean;
  onTitleInputBlur: () => void;
  hasTouched:
}

const TitleInput = ({title, setTitle, titleCharLimit, isEditable, onTitleInputBlur}: TitleInputProps) => {
  return (
    <View className="h-32">
          <StyledLabel label="Title" />
          <StyledTextInput
            placeholder="Enter a title"
            onChangeText={setTitle}
            value={title}
            maxLen={titleCharLimit}
            multiline={true}
            editable={isEditable}
            onBlur={onTitleInputBlur}
            autoCapitalize="sentences"
          />
        </View>
        {hasTouched.title && !hasValidTitle && (
          <ErrorText>Your title cannot be empty.</ErrorText>
        )}
        {title.length == titleCharLimit && (
          <ErrorText>
            Max length of {titleCharLimit.toString()} characters reached.
          </ErrorText>
        )}
  )
}
export default TitleInput