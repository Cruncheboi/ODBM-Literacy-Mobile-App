import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import { ViewPostSearchParams } from "@/app/postActions/viewPost";
import { PostType } from "@/firebaseConfig";
import { useCreateCommentMutation } from "@/redux/services/injectedEndpoints.ts/comments";

export type CommentSearchParams = {
  postID: string;
  postType: PostType;
};

type Status = "submitting" | "typing";

const CreateComment = () => {
  // Constant values
  const { postID, postType } = useLocalSearchParams<CommentSearchParams>();
  const bodyCharLimit = 5000;

  // Comment state
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<Status>("typing");
  const hasValidBody = body.length > 0 && body.trim() !== "";
  const [hasTouched, setHasTouched] = useState(false);
  const [createComment] = useCreateCommentMutation();

  const onPostSubmit = async () => {
    if (status === "submitting") return;
    if (hasValidBody) {
      setStatus("submitting");
      console.log("postType in CreateComment:", postType);
      try {
        await createComment({
          postId: postID,
          body,
          postType,
        }).unwrap();
        router.dismissTo({
          pathname: "/postActions/viewPost",
          params: {
            postID: postID,
            postType,
          } as ViewPostSearchParams,
        });
      } catch {
        setStatus("typing");
      }
    }
    console.log("continued");
  };

  const onBlur = () => {
    if (!hasTouched) {
      setHasTouched(true);
    }
  };

  return (
    <CustomHeader title="Create a Comment">
      <ScrollView
        className="w-full px-3 pb-3 flex"
        contentContainerClassName="gap-3"
      >
        <View className="w-full flex items-center mt-3">
          <StyledLabel label="Share your thoughts about this post!" />
        </View>
        {/** Body */}
        <View className="h-60">
          <StyledLabel label="Comment" />
          <StyledTextInput
            placeholder="Enter your thoughts here..."
            onChangeText={setBody}
            value={body}
            maxLen={bodyCharLimit}
            multiline={true}
            editable={status !== "submitting"}
            onBlur={onBlur}
            autoCapitalize="sentences"
          />
        </View>
        {body.length == bodyCharLimit && (
          <ErrorText>
            Max length of {bodyCharLimit.toString()} characters reached.
          </ErrorText>
        )}
        {hasTouched && !hasValidBody && (
          <ErrorText>Your comment cannot be empty.</ErrorText>
        )}
        <View>
          <CustomOpacityButton
            title="Create Comment"
            onPress={onPostSubmit}
            disabled={status === "submitting" || !hasValidBody}
          />
        </View>
      </ScrollView>
    </CustomHeader>
  );
};
export default CreateComment;
