import { TestimonyPost } from "@/definitions/posts";
import {
  StyledPostHeading,
  StyledPostBody,
  StyledPostTitle,
} from "./styledPostContent";

interface TestimonyPostProps {
  post: TestimonyPost;
}

const TestimonyPostDisplay = ({ post }: TestimonyPostProps) => {
  const { timestamp, authorName, title, body } = post;
  const postDate = new Date(timestamp);
  return (
    <>
      <StyledPostHeading authorName={authorName} postDate={postDate} />
      <StyledPostTitle title={title} />
      <StyledPostBody body={body} />
    </>
  );
};
export default TestimonyPostDisplay;
