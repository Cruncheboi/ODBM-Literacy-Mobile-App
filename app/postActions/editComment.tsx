import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { useAppDispatch } from "@/redux/hooks";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import { useUpdateCommentMutation } from "@/redux/services/injectedEndpoints.ts/comments";

export type EditCommentSearchParams = {
  postID: string;
  documentId: string;
  oldBody: string;
  numOfreports: string;
};

type Status = "submitting" | "typing";

const EditComment = () => {
  // Constant values
  const { postID, documentId, oldBody, numOfreports } =
    useLocalSearchParams<EditCommentSearchParams>();
  const [updateComment, result] = useUpdateCommentMutation();

  // Comment state
  const [body, setBody] = useState(oldBody);
  const hasValidBody = body.length > 0 && body.trim() !== "";
  const bodyCharLimit = 5000;
  const [status, setStatus] = useState<Status>("typing");
  const [hasTouched, setHasTouched] = useState(false);

  const onPostSubmit = async () => {
    if (status === "submitting") return;
    if (hasValidBody) {
      setStatus("submitting");
      try {
        const wasSuccessful = await updateComment({
          postId: postID,
          documentId,
          udpatedFields: { body },
          reports: Number.parseInt(numOfreports),
        }).unwrap();

        if (wasSuccessful) {
          router.back();
        } else {
          setStatus("typing");
        }
      } catch (error) {
        console.error("An error occurred on Post Update:", error);
        setStatus("typing");
      }
    }
  };

  const onBlur = () => {
    if (!hasTouched) {
      setHasTouched(true);
    }
  };

  return (
    <CustomHeader title="Edit Your Comment">
      <ScrollView
        className="w-full px-3 pb-3 flex"
        contentContainerClassName="gap-3"
      >
        <View className="w-full flex items-center mt-3">
          <StyledLabel label="Update your thoughts about this post!" />
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
            title="Update Comment"
            onPress={onPostSubmit}
            disabled={status === "submitting" || !hasValidBody}
          />
        </View>
      </ScrollView>
    </CustomHeader>
  );
};
export default EditComment;
