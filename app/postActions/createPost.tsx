import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import StyledLabel from "@/components/styledLabel";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import { PostType } from "@/definitions/posts";
import {
  StyledBodyInput,
  StyledTitleInput,
  StyledYoutubeUrlInput,
} from "@/components/posts/styledEditPostContent";
import {
  CompressedImagePayload,
  InitializeImageInfo,
} from "@/definitions/media";
import {
  useActivatePostMutation,
  useInitializePostMutation,
} from "@/redux/query_services/injectedEndpoints.ts/posts";
import { ImagePicker } from "@/components/bottom_sheet/media/imagePicker";
import { selectAndCompress } from "@/utility_functions/images/compression";
import { uploadImagesToBackblaze } from "@/utility_functions/images/upload";

export type CreatePostSearchParams = {
  postType: PostType;
};

type Status = "submitting" | "typing";

const CreatePost = () => {
  // Input state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedImages, setSelectedImages] = useState<
    CompressedImagePayload[]
  >([]);
  // find if an image is currently compressing
  const allImagesCompressed =
    selectedImages.findIndex((image) => image.isCompressing === true) === -1;

  //Input validation
  const hasValidTitle = title.length > 0 && title.trim() !== "";
  const hasValidBody = body.length > 0 && body.trim() !== "";

  // Post state
  const [status, setStatus] = useState<Status>("typing");
  const { postType } = useLocalSearchParams<CreatePostSearchParams>();
  const [hasTouched, setHasTouched] = useState({
    title: false,
    body: false,
  });

  const onTitleInputBlur = () => {
    if (!hasTouched.title) {
      setHasTouched((prev) => ({ ...prev, title: true }));
    }
  };

  const onBodyInputBlur = () => {
    if (!hasTouched.body) {
      setHasTouched((prev) => ({ ...prev, body: true }));
    }
  };

  // RTK Query mutations
  const [initializePost] = useInitializePostMutation();
  const [activatePost] = useActivatePostMutation();

  const isEditable = status !== "submitting";

  // Handles post creation flow
  const onPostSubmit = async () => {
    if (
      status === "submitting" ||
      !hasValidTitle ||
      !hasValidBody ||
      !allImagesCompressed
    )
      return;

    setStatus("submitting");
    try {
      //Initialize Post and get presigned assets
      const contentInfo: InitializeImageInfo[] = selectedImages.map(
        ({ width, height, contentLength, imageHash, mimeType }) => ({
          width,
          height,
          contentLength,
          imageHash,
          mimeType,
        }),
      );

      console.log(contentInfo);

      const initResponse = await initializePost({
        postType,
        title,
        body,
        youtubeUrl: postType === "event" ? youtubeUrl : null,
        contentInfo,
      }).unwrap();

      const { postId, presignedAssets } = initResponse;
      const successfulUploadIds = await uploadImagesToBackblaze(
        selectedImages,
        presignedAssets,
      );

      // Activate post and its content to show up on feeds
      const activationResponse = await activatePost({
        postId,
        postType,
        successfulImageIds: successfulUploadIds,
      }).unwrap();

      router.back();
    } catch (workflowException: any) {
      console.error(
        "The posting sequence pipeline crashed:",
        workflowException,
      );

      const errorMessage =
        workflowException?.data?.error ||
        "A secure network connection could not be established.";
      console.error("Submission Suspended", errorMessage);
    } finally {
      // Release UI interface screen lock inputs
      setStatus("typing");
    }
  };

  return (
    <CustomHeader title="Create a Post">
      <ScrollView
        className="flex w-full px-3 pb-3"
        contentContainerClassName="gap-3"
      >
        <View className="mt-3 flex w-full items-center">
          <StyledLabel label="Share your story with others!" />
        </View>
        {/** Title */}
        <StyledTitleInput
          title={title}
          setTitle={setTitle}
          hasTouched={hasTouched}
          hasValidTitle={hasValidTitle}
          isEditable={isEditable}
          onBlur={onTitleInputBlur}
        />
        {/** Body */}
        <StyledBodyInput
          body={body}
          setBody={setBody}
          hasTouched={hasTouched}
          hasValidBody={hasValidBody}
          isEditable={isEditable}
          onBlur={onBodyInputBlur}
        />
        {/** Event Youtube Url */}
        {postType === "event" && (
          <StyledYoutubeUrlInput
            youtubeUrl={youtubeUrl}
            setYoutubeUrl={(url) => setYoutubeUrl(url.trim())}
            isEditable={isEditable}
          />
        )}
        <ImagePicker
          selectedImages={selectedImages}
          onToggleAsset={(asset) =>
            selectAndCompress(asset, selectedImages, setSelectedImages)
          }
          disabled={status === "submitting"}
        />
        <CustomOpacityButton
          title="Create Post"
          onPress={onPostSubmit}
          disabled={
            status === "submitting" ||
            !hasValidBody ||
            !hasValidTitle ||
            !allImagesCompressed
          }
        />
      </ScrollView>
    </CustomHeader>
  );
};
export default CreatePost;
