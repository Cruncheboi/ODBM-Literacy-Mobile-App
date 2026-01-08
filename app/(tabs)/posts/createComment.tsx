import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { createComment } from "@/firebase_functions/firebaseFunctions";
import { appendCommentToStart } from "@/redux/features/commentsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";
import { SearchParams } from "./viewPost";
import { PostType } from ".";

export type CommentSearchParams = {
  postID: string;
  postType: PostType;
};

type Status = "submitting" | "typing";

const CreateComment = () => {
  // Constant values
  const { postID, postType } = useLocalSearchParams<CommentSearchParams>();
  const dispatch = useAppDispatch();
  const bodyCharLimit = 5000;

  // Comment state
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<Status>("typing");
  const hasValidBody = body.length > 0 && body.trim() !== "";
  const [hasTouched, setHasTouched] = useState(false);

  const onPostSubmit = async () => {
    if (hasValidBody) {
      setStatus("submitting");
      await onCreateComment();
    }
    console.log("continued");
  };

  const onCreateComment = async () => {
    const newComment = await createComment(postID, body);
    if (newComment) {
      dispatch(appendCommentToStart({ comment: newComment }));
      router.dismissTo({
        pathname: "/(tabs)/posts/viewPost",
        params: {
          postID: postID,
          postType: postType,
        } as SearchParams,
      });
    } else {
      setStatus("typing");
    }
  };

  const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (!hasTouched) {
      setHasTouched(true);
    }
  };

  return (
    <CustomHeader title="Create a Comment" contentContainerClassName="">
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
