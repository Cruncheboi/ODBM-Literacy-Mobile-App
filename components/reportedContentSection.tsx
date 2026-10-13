import { ActivityIndicator, Text, View } from "react-native";
import CustomSectionSeparator from "./customSectionSeparator";
import StyledButton from "./styledButton";
import StyledLabel from "./styledLabel";
import { useCallback } from "react";
import { router } from "expo-router";
import { ViewPostSearchParams } from "@/app/postActions/viewPost";
import TestimonyPostDisplay from "./posts/testimonyPost";
import EventPostDisplay from "./posts/eventPost";
import {
  CommentPostDisplay,
  LinkToParentPostButton,
} from "./comments/commentPost";
import { Post } from "@/definitions/posts";
import { AdminCommentPost } from "@/definitions/moderation";

interface Props {
  content?: Post | AdminCommentPost | null;
}

const ReportedContentSection = ({ content }: Props) => {
  if (!content) {
    return <ActivityIndicator />;
  }

  const { postType } = content;

  return (
    <>
      {postType === "testimony" && <TestimonyPostDisplay post={content} />}
      {postType === "event" && <EventPostDisplay post={content} />}
      {postType === "comment" && (
        <>
          <CommentPostDisplay post={content} />
          <LinkToParentPostButton
            postId={String(content.postId)}
            parentPostType={content.parentPostType}
          />
        </>
      )}
      <CustomSectionSeparator />
      <View className="mb-2 flex flex-row">
        <View className="flex-1">
          <Text className="text-xl font-semibold text-odbm-blue-600 dark:text-gray-200">
            Reports
          </Text>
        </View>
      </View>
    </>
  );
};

export default ReportedContentSection;
