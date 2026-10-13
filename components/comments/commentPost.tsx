import { CommentPost } from "@/definitions/comments";
import { StyledPostHeading, StyledPostBody } from "../posts/styledPostContent";
import StyledButton from "../styledButton";
import StyledLabel from "../styledLabel";
import { router } from "expo-router";
import { ViewPostSearchParams } from "@/app/postActions/viewPost";
import { PostType } from "@/definitions/posts";

interface CommentPostProps {
  post: CommentPost;
}

interface LinkToParentPostButtonProps {
  postId: string;
  parentPostType: PostType;
}

export const CommentPostDisplay = ({ post }: CommentPostProps) => {
  const { timestamp, authorName, body } = post;
  const postDate = new Date(timestamp);
  return (
    <>
      <StyledPostHeading authorName={authorName} postDate={postDate} />
      <StyledPostBody body={body} />
    </>
  );
};

export const LinkToParentPostButton = ({
  postId,
  parentPostType,
}: LinkToParentPostButtonProps) => (
  <StyledButton
    className="border-borderColor-primary bg-bgColor-primary"
    label={<StyledLabel label="View parent post" />}
    onPress={() => {
      router.push({
        pathname: "/postActions/viewPost",
        params: {
          postId,
          postType: parentPostType,
        } as ViewPostSearchParams,
      });
    }}
  />
);
