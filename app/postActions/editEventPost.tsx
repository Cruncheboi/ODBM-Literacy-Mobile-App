import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledEditPostBackground from "@/components/posts/styledEditPostContent";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { PostType } from "@/definitions/posts";
import { auth } from "@/firebaseConfig";
import {
  useGetEventQuery,
  useUpdateEventMutation,
} from "@/redux/query_services/injectedEndpoints.ts/events";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, ScrollView } from "react-native";

export type EditEventPostSearchParams = {
  postId: string;
};

type Status = "submitting" | "typing";

const EditEventPost = () => {
  // Post state
  const [status, setStatus] = useState<Status>("typing");
  const { postId } = useLocalSearchParams<EditEventPostSearchParams>();
  const [hasTouched, setHasTouched] = useState({
    title: false,
    body: false,
  });
  const eventResult = useGetEventQuery({
    postId,
    userId: auth.currentUser?.uid,
  });
  const event = eventResult.data;

  if (!event) {
    if (eventResult.isFetching) {
      return (
        <StyledEditPostBackground>
          <StyledLabel label="Loading the details of your perfect post!" />
        </StyledEditPostBackground>
      );
    } else {
      return (
        <StyledEditPostBackground>
          <StyledLabel label="Post was unable to load." />
        </StyledEditPostBackground>
      );
    }
  }
  const { title: oldTitle, body: oldBody, images, youtubeId } = event;
  const [updateEventPost] = useUpdateEventMutation();
  const isEditable = status !== "submitting" && !eventResult.isFetching;
  // Title state
  const [title, setTitle] = useState(oldTitle);
  const hasValidTitle = title.length > 0 && title.trim() !== "";

  // Body state
  const [body, setBody] = useState(oldBody);
  const hasValidBody = body.length > 0 && body.trim() !== "";

  // Constant post values
  const titleCharLimit = 256;
  const bodyCharLimit = 5000;

  const onPostSubmit = async () => {
    if (status === "submitting") return;
    if (hasValidTitle && hasValidBody) {
      setStatus("submitting");
      try {
        await updateEventPost({
          postId,
          body,
          images,
          title,
          youtubeId,
        }).unwrap();
        router.back();
      } catch (error) {
        console.error("An error occurred on Post Update:", error);
        setStatus("typing");
      }
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
    <CustomHeader title="Edit Your Post">
      <ScrollView
        className="flex w-full px-3 pb-3"
        contentContainerClassName="gap-3"
      >
        <View className="mt-3 flex w-full items-center">
          <StyledLabel label="Make your edits down below!" />
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
        {/** Body */}
        <View className="h-60">
          <StyledLabel label="Story" />
          <StyledTextInput
            placeholder="Enter your story here..."
            onChangeText={setBody}
            value={body}
            maxLen={bodyCharLimit}
            multiline={true}
            editable={isEditable}
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
            title="Update Post"
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
export default EditEventPost;
