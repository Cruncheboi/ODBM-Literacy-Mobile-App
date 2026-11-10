import { TestimonyPost } from "@/definitions/posts";
import {
  StyledPostHeading,
  StyledPostBody,
  StyledPostTitle,
} from "./styledPostContent";
import ImageDisplay from "../images/imageDisplay";
import { View } from "react-native";

interface TestimonyPostProps {
  post: TestimonyPost;
}

const TestimonyPostDisplay = ({ post }: TestimonyPostProps) => {
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
export default TestimonyPostDisplay;
