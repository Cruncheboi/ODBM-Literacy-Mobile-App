import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { useCreateTestimonyMutation } from "@/redux/query_services/injectedEndpoints.ts/testimonies";
import { useCreateEventMutation } from "@/redux/query_services/injectedEndpoints.ts/events";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import { PostType } from "@/definitions/posts";
import {
  StyledBodyInput,
  StyledTitleInput,
} from "@/components/posts/styledEditPostContent";

export type CreatePostSearchParams = {
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
  const { type } = useLocalSearchParams<CreatePostSearchParams>();
  const [hasTouched, setHasTouched] = useState({
    title: false,
    body: false,
  });
  const [createTestimony] = useCreateTestimonyMutation();
  const [createEvent] = useCreateEventMutation();
  const isEditable = status !== "submitting";

  const onPostSubmit = async () => {
    if (status === "submitting") return;
    if (hasValidTitle && hasValidBody) {
      setStatus("submitting");
      try {
        if (type === "testimony") {
          await createTestimony({ body, title }).unwrap();
        } else {
          await createEvent({ body, title }).unwrap();
        }
        router.back();
      } catch (error) {
        console.log(error);
        setStatus("typing");
      }
    }
    console.log("continued");
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
        className="flex w-full px-3 pb-3"
        contentContainerClassName="gap-3"
      >
        <View className="mt-3 flex w-full items-center">
          <StyledLabel label="Share your story with others!" />
        </View>
        {/** Title */}
        <StyledTitleInput
          title={title}
          setTitle={setTitle}
          hasTouched={hasTouched}
          hasValidTitle={hasValidTitle}
          isEditable={isEditable}
          onBlur={onTitleInputBlur}
        />
        {/* <View className="h-32">
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
        )} */}
        {/** Body */}
        <StyledBodyInput
          body={body}
          setBody={setBody}
          hasTouched={hasTouched}
          hasValidBody={hasValidBody}
          isEditable={isEditable}
          onBlur={onBodyInputBlur}
        />
        {/* <View className="h-60">
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
        )} */}
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
