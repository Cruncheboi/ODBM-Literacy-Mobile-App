import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import StyledEditPostBackground, {
  StyledBodyInput,
  StyledTitleInput,
  StyledYoutubeUrlInput,
} from "@/components/posts/styledEditPostContent";
import StyledLabel from "@/components/styledLabel";
import { PostType } from "@/definitions/posts";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { View, ScrollView } from "react-native";
import { useGetPostQuery } from "./viewPost";
import {
  usePresignEditPostImagesMutation,
  useUpdatePostMutation,
} from "@/redux/query_services/injectedEndpoints.ts/posts";
import { ImagePicker } from "@/components/bottom_sheet/media/imagePicker";
import {
  CompressedImagePayload,
  ExistingImage,
  ImageInfo,
  ImageInfoEditable,
  NonExistingImage,
} from "@/definitions/media";
import { selectAndCompress } from "@/utility_functions/images/compression";
import ImageManager from "@/components/images/imageManager";

export type EditPostSearchParams = {
  postId: string;
  postType: PostType;
};

export type TouchedFields = {
  title: boolean;
  body: boolean;
};

type Status = "submitting" | "typing";

const EditPost = () => {
  // Post state
  const [status, setStatus] = useState<Status>("typing");
  const { postId, postType } = useLocalSearchParams<EditPostSearchParams>();
  const numericPostId = parseInt(postId, 10);
  const [hasTouched, setHasTouched] = useState({
    title: false,
    body: false,
  });

  const postResult = useGetPostQuery(postType, numericPostId);
  const post = postResult.data;
  // Handle when there is no post to display
  if (!post) {
    if (postResult.isFetching) {
      return (
        <StyledEditPostBackground>
          <StyledLabel label="Loading the details of your perfect post!" />
        </StyledEditPostBackground>
      );
    } else {
      return (
        <View>
          <StyledLabel label="Post was unable to load." />
        </View>
      );
    }
  }

  // Post info and actions
  const { title: oldTitle, body: oldBody, images: oldImages } = post;
  const oldYoutubeUrl =
    post.postType === "event" && post.youtubeId ? post.youtubeId : "";
  const existingImages: ExistingImage[] = useMemo(
    () => oldImages?.map((image) => ({ isExisting: true, ...image })) ?? [],
    [oldImages],
  );

  const [updatePost] = useUpdatePostMutation();
  const [presignEditPostImages] = usePresignEditPostImagesMutation();

  // Input state
  const [title, setTitle] = useState(oldTitle);
  const [body, setBody] = useState(oldBody);
  const [youtubeUrl, setYoutubeUrl] = useState(oldYoutubeUrl);
  const [newSelectedImages, setNewSelectedImages] = useState<
    CompressedImagePayload[]
  >([]);
  const nonExistingImages: NonExistingImage[] = useMemo(
    () =>
      newSelectedImages.map((image) => ({ isExisting: false, ...image })) ?? [],
    [newSelectedImages],
  );

  const [allSelectedImages, setAllSelectedImages] =
    useState<ImageInfoEditable[]>(existingImages);

  // Validation
  const hasValidTitle = title.length > 0 && title.trim() !== "";
  const hasValidBody = body.length > 0 && body.trim() !== "";
  const isEditable = status !== "submitting" && !postResult.isFetching;
  const allImagesCompressed =
    newSelectedImages.findIndex((image) => image.isCompressing === true) === -1;
  const hasChanged = useMemo(
    () => oldTitle.trim() !== title.trim() || oldBody.trim() !== body.trim(),
    [body, title],
  );

  const onPostSubmit = async () => {
    if (status === "submitting") return;
    if (hasValidTitle && hasValidBody) {
      setStatus("submitting");
      try {
        router.back();
      } catch (error) {
        console.error("An error occurred on Post Update:", error);
        setStatus("typing");
      }
    }
  };

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

  return (
    <CustomHeader title="Edit Your Post">
      <ScrollView
        className="flex w-full px-3 pb-3"
        contentContainerClassName="gap-3"
      >
        <View className="mt-3 flex w-full items-center">
          <StyledLabel label="Make your corrections down below!" />
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
        {/** New Images */}
        <ImagePicker
          selectedImages={newSelectedImages}
          onToggleAsset={(asset) =>
            selectAndCompress(asset, newSelectedImages, setNewSelectedImages)
          }
          disabled={status === "submitting"}
        />
        <ImageManager
          images={allSelectedImages}
          setImages={setAllSelectedImages}
          disabled={status === "submitting" && !isEditable}
        />
        {/** Submit Button */}
        <View>
          <CustomOpacityButton
            title="Update Post"
            onPress={onPostSubmit}
            disabled={
              status === "submitting" ||
              !hasValidBody ||
              !hasValidTitle ||
              !hasChanged ||
              !allImagesCompressed
            }
          />
        </View>
      </ScrollView>
    </CustomHeader>
  );
};
export default EditPost;
