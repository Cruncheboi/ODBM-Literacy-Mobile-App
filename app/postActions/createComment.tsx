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
import { useCreateCommentMutation } from "@/redux/query_services/injectedEndpoints.ts/comments";
import { COMMENT_CHAR_LIMIT } from "@/definitions/comments";

export type CommentSearchParams = {
  postId: string;
  postType: PostType;
};

type Status = "submitting" | "typing";

const CreateComment = () => {
  // Constant values
  const { postId, postType } = useLocalSearchParams<CommentSearchParams>();
  const numericPostId = parseInt(postId, 10);

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
          postId: numericPostId,
          body,
        }).unwrap();
        router.dismissTo({
          pathname: "/postActions/viewPost",
          params: {
            postId,
            postType,
          } as ViewPostSearchParams,
        });
      } catch (error) {
        console.log(error);
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
        className="flex w-full px-3 pb-3"
        contentContainerClassName="gap-3"
      >
        <View className="mt-3 flex w-full items-center">
          <StyledLabel label="Share your thoughts about this post!" />
        </View>
        {/** Body */}
        <View className="h-60">
          <StyledLabel label="Comment" />
          <StyledTextInput
            placeholder="Enter your thoughts here..."
            onChangeText={setBody}
            value={body}
            maxLen={COMMENT_CHAR_LIMIT}
            multiline={true}
            editable={status !== "submitting"}
            onBlur={onBlur}
            autoCapitalize="sentences"
          />
        </View>
        {body.length == COMMENT_CHAR_LIMIT && (
          <ErrorText>
            Max length of {COMMENT_CHAR_LIMIT.toString()} characters reached.
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
