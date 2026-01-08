import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { createPost } from "@/firebase_functions/firebaseFunctions";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, ScrollView } from "react-native";
import type { PostType } from "./index";

export type PostSearchParams = {
  type: PostType;
};

type Status = "submitting" | "typing";

const CreatePost = () => {
  // Title state
  const [title, setTitle] = useState("");
  const hasValidTitle = title.length > 0 && title.trim() !== "";

  // Body state
  const [body, setBody] = useState("");
  const hasValidBody = body.length > 0 && body.trim() !== "";

  // Post state
  const [status, setStatus] = useState<Status>("typing");
  const { type } = useLocalSearchParams<PostSearchParams>();
  const [hasTouched, setHasTouched] = useState({
    title: false,
    body: false,
  });

  // Constant post values
  const titleCharLimit = 256;
  const bodyCharLimit = 5000;

  const onPostSubmit = async () => {
    if (status === "submitting") return;
    if (hasValidTitle && hasValidBody) {
      setStatus("submitting");
      await createNewPost();
    }
    console.log("continued");
  };

  const createNewPost = async () => {
    const wasSuccessful = await createPost(title, body, { type: type });
    if (wasSuccessful) {
      router.dismissTo("/(tabs)/posts");
    } else {
      setStatus("typing");
    }
  };

  const onTitleInputBlur = () => {
    if (!hasTouched.title) {
      setHasTouched((prev) => ({ ...prev, title: true }));
    }
  };

  const onBodyInputBlur = () => {
    if (!hasTouched.body) {
      setHasTouched((prev) => ({ ...prev, body: true }));
    }
  };

  return (
    <CustomHeader title="Create a Post">
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
            editable={status !== "submitting"}
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
        {/** Body */}
        <View className="h-60">
          <StyledLabel label="Story" />
          <StyledTextInput
            placeholder="Enter your story here..."
            onChangeText={setBody}
            value={body}
            maxLen={bodyCharLimit}
            multiline={true}
            editable={status !== "submitting"}
            onBlur={onBodyInputBlur}
            autoCapitalize="sentences"
          />
        </View>
        {body.length == bodyCharLimit && (
          <ErrorText>
            Max length of {bodyCharLimit.toString()} characters reached.
          </ErrorText>
        )}
        {hasTouched.body && !hasValidBody && (
          <ErrorText>Your story cannot be empty.</ErrorText>
        )}
        <View>
          <CustomOpacityButton
            title="Create Post"
            onPress={onPostSubmit}
            disabled={
              status === "submitting" || !hasValidBody || !hasValidTitle
            }
          />
        </View>
      </ScrollView>
    </CustomHeader>
  );
};
export default CreatePost;
