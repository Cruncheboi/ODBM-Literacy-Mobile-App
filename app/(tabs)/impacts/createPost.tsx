import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { createPost } from "@/firebase_functions/firebaseFunctions";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [hasValidTitle, setHasValidTitle] = useState(false);
  const [hasValidBody, setHasValidBody] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const titleCharLimit = 256;
  const bodyCharLimit = 5000;

  const onPostSubmit = async () => {
    if (buttonDisabled) return;
    if (hasValidTitle && hasValidTitle) {
      setButtonDisabled(true);
      createPost(title, body).then((wasSuccessful) => {
        if (wasSuccessful) {
          router.replace("/(tabs)/impacts");
        } else {
          console.log("Something went wrong creating the post.");
        }
        setButtonDisabled(false);
      });
    }
    console.log("continued");
  };

  const titleTextRequirementChecks = useEffect(() => {
    if (title.length > 0 && title.trim() !== "") {
      setHasValidTitle(true);
    } else {
      setHasValidTitle(false);
    }
  }, [title]);

  const bodyTextRequirementChecks = useEffect(() => {
    if (body.length > 0 && body.trim() !== "") {
      setHasValidBody(true);
    } else {
      setHasValidBody(false);
    }
  }, [body]);

  const buttonAvailabilityCheck = useEffect(() => {
    if (!hasValidBody || !hasValidTitle) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [hasValidTitle, hasValidBody]);

  return (
    <CustomHeader title="Create a Post" contentContainerClassName="">
      <ScrollView
        className="w-full px-3 pb-3 flex"
        contentContainerClassName="gap-3"
      >
        <View className="w-full flex items-center mt-3">
          <StyledLabel label="Share your testimony with others!" />
        </View>
        {/** Title */}
        <View className="h-32">
          <StyledLabel label="Title" />
          <StyledTextInput
            placeholder="Enter a title"
            onChangeText={setTitle}
            value={title}
            maxLen={titleCharLimit}
            multiline={true}
          />
        </View>
        {!hasValidTitle && (
          <ErrorText>The title needs to be non-empty.</ErrorText>
        )}
        {title.length == titleCharLimit && (
          <ErrorText>
            Max length of {titleCharLimit.toString()} characters reached.
          </ErrorText>
        )}
        {/** Body */}
        <View className="h-60">
          <StyledLabel label="Story" />
          <StyledTextInput
            placeholder="Enter your story here..."
            onChangeText={setBody}
            value={body}
            maxLen={bodyCharLimit}
            multiline={true}
          />
        </View>
        {body.length == bodyCharLimit && (
          <ErrorText>
            Max length of {bodyCharLimit.toString()} characters reached.
          </ErrorText>
        )}
        {!hasValidBody && (
          <ErrorText>The story needs to be non-empty.</ErrorText>
        )}
        <View>
          <CustomOpacityButton
            title="Create Post"
            onPress={onPostSubmit}
            disabled={buttonDisabled}
          />
        </View>
      </ScrollView>
    </CustomHeader>
  );
};
export default CreatePost;
