import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { auth } from "@/firebaseConfig";
import { createPost } from "@/redux/storageSync";
import { router } from "expo-router";
import { FieldValue, serverTimestamp } from "firebase/firestore";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { View, Text, ScrollView } from "react-native";
const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const titleCharLimit = 256;
  const bodyCharLimit = 5000;

  const onPostSubmit = async () => {
    if (buttonDisabled) return;
    if (
      body.length > 0 &&
      title.length > 0 &&
      body.trim() !== "" &&
      title.trim() !== ""
    ) {
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

  return (
    <CustomHeader title="Create a Post" contentContainerClassName="items-start">
      <ScrollView className="w-full gap-3 px-3 pb-3 flex">
        {/** Title */}
        <View>
          <StyledLabel label="Title" />
          <StyledTextInput
            placeholder="Enter a title"
            onChangeText={setTitle}
            maxLen={titleCharLimit}
          />
        </View>
        {title.length == titleCharLimit && (
          <ErrorText>
            Max length of {titleCharLimit.toString()} characters reached.
          </ErrorText>
        )}
        {/** Body */}
        <View>
          <StyledLabel label="Story" />
          <StyledTextInput
            placeholder="Enter your story here..."
            onChangeText={setBody}
            maxLen={bodyCharLimit}
            multiline={true}
          />
        </View>
        {body.length == bodyCharLimit && (
          <ErrorText>
            Max length of {bodyCharLimit.toString()} characters reached.
          </ErrorText>
        )}
        {(body.length == 0 ||
          title.length == 0 ||
          body.trim() === "" ||
          title.trim() === "") && (
          <ErrorText>The title and story need to be non-empty.</ErrorText>
        )}
        <View className="grow justify-end">
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
