import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledEditPostBackground, {
  StyledTitleInput,
} from "@/components/posts/styledEditPostContent";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { Post, PostType } from "@/definitions/posts";
import { auth } from "@/firebaseConfig";
import {
  useGetEventQuery,
  useUpdateEventMutation,
} from "@/redux/query_services/injectedEndpoints.ts/events";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, ScrollView } from "react-native";

export type EditPostSearchParams = {
  postId: string;
  postType: PostType;
};

export type TouchedFields = {
  title: boolean;
  body: boolean;
};

type Status = "submitting" | "typing";

const EditPost = () => {
  // Post state
  const [status, setStatus] = useState<Status>("typing");
  const { postId, postType } = useLocalSearchParams<EditPostSearchParams>();
  const [hasTouched, setHasTouched] = useState<TouchedFields>({
    title: false,
    body: false,
  });

  const [post, setPost] = useState<Post>();

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

  const postComponent = () => {
    if (postType === "event") {
      return (
        <>
          <StyledTitleInput title={title} setTitle={() => setT} />
        </>
      );
    }

    return <></>;
  };

  return <StyledEditPostBackground>{postComponent()}</StyledEditPostBackground>;
};
export default EditPost;
