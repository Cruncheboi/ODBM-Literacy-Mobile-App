import { EventPost } from "@/definitions/posts";
import StyledPostHeading, {
  StyledPostBody,
  StyledPostTitle,
} from "./styledPostContent";

interface EventPostProps {
  post: EventPost;
}

const EventPostDisplay = ({ post }: EventPostProps) => {
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
export default EventPostDisplay;
