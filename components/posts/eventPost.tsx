import { EventPost } from "@/definitions/posts";
import {
  StyledPostHeading,
  StyledPostBody,
  StyledPostTitle,
} from "./styledPostContent";
import { View } from "react-native";
import ImageDisplay from "../images/imageDisplay";

interface EventPostProps {
  post: EventPost;
}

const EventPostDisplay = ({ post }: EventPostProps) => {
  const { timestamp, authorName, title, body, images } = post;
  const postDate = new Date(timestamp);
  return (
    <>
      <StyledPostHeading authorName={authorName} postDate={postDate} />
      <StyledPostTitle title={title} />
      {images && images.length > 0 && (
        <View className="mt-4">
          <ImageDisplay images={images} />
        </View>
      )}
      <StyledPostBody body={body} />
    </>
  );
};
export default EventPostDisplay;
