import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledEditPostBackground, {
  StyledTitleInput,
} from "@/components/posts/styledEditPostContent";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { BODY_CHAR_LIMIT } from "@/definitions/posts";
import { auth } from "@/firebaseConfig";
import {
  useGetTestimonyQuery,
  useUpdateTestimonyMutation,
} from "@/redux/query_services/injectedEndpoints.ts/testimonies";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, ScrollView } from "react-native";

export type EditTestimonyPostSearchParams = {
  postId: string;
};

export type TouchedFields = {
  title: boolean;
  body: boolean;
};

type Status = "submitting" | "typing";

const EditTestimonyPost = () => {
  // Post state
  const [status, setStatus] = useState<Status>("typing");
  const { postId } = useLocalSearchParams<EditTestimonyPostSearchParams>();
  const [hasTouched, setHasTouched] = useState({
    title: false,
    body: false,
  });
  const testimonyResult = useGetTestimonyQuery({
    postId,
    userId: auth.currentUser?.uid,
  });
  const testimony = testimonyResult.data;
  const isEditable = status !== "submitting" && testimonyResult.isFetching;
  // Handle when there is no post to display
  if (!testimony) {
    if (testimonyResult.isFetching) {
      return (
        <StyledEditPostBackground>
          <StyledLabel label="Loading the details of your perfect post!" />
        </StyledEditPostBackground>
      );
    } else {
      return (
        <View>
          <StyledLabel label="Testimony was unable to load." />
        </View>
      );
    }
  }
  const { title: oldTitle, body: oldBody, images } = testimony;
  const [updateTestimonyPost] = useUpdateTestimonyMutation();

  // Title state
  const [title, setTitle] = useState(oldTitle);
  const hasValidTitle = title.length > 0 && title.trim() !== "";

  // Body state
  const [body, setBody] = useState(oldBody);
  const hasValidBody = body.length > 0 && body.trim() !== "";

  const onPostSubmit = async () => {
    if (status === "submitting") return;
    if (hasValidTitle && hasValidBody) {
      setStatus("submitting");
      try {
        await updateTestimonyPost({
          postId,
          title,
          body,
          images,
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

  const onSetTitle = (title: string) => {
    setTitle(title);
  };

  return (
    <CustomHeader title="Edit Your Post">
      <ScrollView
        className="flex w-full px-3 pb-3"
        contentContainerClassName="gap-3"
      >
        <View className="mt-3 flex w-full items-center">
          <StyledLabel label="Make your corrections down below!" />
        </View>
        {/** Title */}
        <StyledTitleInput
          title={title}
          setTitle={onSetTitle}
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
            maxLen={TITLE_CHAR_LIMIT}
            multiline={true}
            editable={status !== "submitting"}
            onBlur={onTitleInputBlur}
            autoCapitalize="sentences"
          />
        </View>
        {hasTouched.title && !hasValidTitle && (
          <ErrorText>Your title cannot be empty.</ErrorText>
        )}
        {title.length == TITLE_CHAR_LIMIT && (
          <ErrorText>
            Max length of {TITLE_CHAR_LIMIT.toString()} characters reached.
          </ErrorText>
        )} */}
        {/** Body */}
        <View className="h-60">
          <StyledLabel label="Story" />
          <StyledTextInput
            placeholder="Enter your story here..."
            onChangeText={setBody}
            value={body}
            maxLen={BODY_CHAR_LIMIT}
            multiline={true}
            editable={status !== "submitting"}
            onBlur={onBodyInputBlur}
            autoCapitalize="sentences"
          />
        </View>
        {body.length == BODY_CHAR_LIMIT && (
          <ErrorText>
            Max length of {BODY_CHAR_LIMIT.toString()} characters reached.
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
export default EditTestimonyPost;
