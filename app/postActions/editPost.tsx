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
import { useCallback, useMemo, useState } from "react";
import { View, ScrollView } from "react-native";
import { useGetPostQuery } from "./viewPost";
import {
  usePresignEditPostImagesMutation,
  useUpdatePostMutation,
} from "@/redux/query_services/injectedEndpoints.ts/posts";
import { ImagePicker } from "@/components/bottom_sheet/media/imagePicker";
import { ExistingImage, ImageInfoEditable } from "@/definitions/media";
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
  const oldYoutubeUrl = useMemo(
    () => (post.postType === "event" && post.youtubeId ? post.youtubeId : ""),
    [post],
  );
  const initialImages: ExistingImage[] = useMemo(
    () => oldImages?.map((image) => ({ isExisting: true, ...image })) ?? [],
    [oldImages],
  );
  const [updatePost] = useUpdatePostMutation();
  const [presignEditPostImages] = usePresignEditPostImagesMutation();

  // Input state
  const [title, setTitle] = useState(oldTitle);
  const [body, setBody] = useState(oldBody);
  const [youtubeUrl, setYoutubeUrl] = useState(oldYoutubeUrl);

  const [selectedImages, setSelectedImages] =
    useState<ImageInfoEditable[]>(initialImages);

  // Validation
  const hasValidTitle = useMemo(
    () => title.length > 0 && title.trim() !== "",
    [title],
  );
  const hasValidBody = useMemo(
    () => body.length > 0 && body.trim() !== "",
    [body],
  );
  const hasChangedTitle = useMemo(
    () => oldTitle.trim() !== title.trim(),
    [title],
  );
  const hasChangedBody = useMemo(() => oldBody.trim() !== body.trim(), [body]);
  const hasChangedYtUrl = useMemo(
    () => oldYoutubeUrl.trim() !== youtubeUrl.trim(),
    [oldYoutubeUrl],
  );
  const hasModifiedImages = useMemo(() => {
    if (!oldImages) return selectedImages.length > 0;

    return !selectedImages.every(
      (image, index) => image.isExisting && image.id === oldImages[index].id,
    );
  }, [selectedImages, oldImages]);
  const hasModifiedPost =
    hasChangedTitle || hasChangedBody || hasChangedYtUrl || hasModifiedImages;
  const isEditable = status !== "submitting" && !postResult.isFetching;
  const allImagesCompressed =
    selectedImages.findIndex(
      (image) => !image.isExisting && image.isCompressing,
    ) === -1;

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

  const onTitleInputBlur = useCallback(() => {
    if (!hasTouched.title) {
      setHasTouched((prev) => ({ ...prev, title: true }));
    }
  }, [hasTouched]);

  const onBodyInputBlur = useCallback(() => {
    if (!hasTouched.body) {
      setHasTouched((prev) => ({ ...prev, body: true }));
    }
  }, [hasTouched]);
  console.log(hasModifiedImages);

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
        {/** Add New Images */}
        <ImagePicker
          selectedImages={selectedImages}
          onToggleAsset={(asset) => {
            selectAndCompress(asset, selectedImages, setSelectedImages);
          }}
          disabled={status === "submitting"}
        />
        {/** Manage Images */}
        <ImageManager
          images={selectedImages}
          setImages={setSelectedImages}
          initialImages={initialImages}
          disabled={status === "submitting" && !isEditable}
        />
        {/** Submit Button */}
        <CustomOpacityButton
          title="Update Post"
          onPress={onPostSubmit}
          disabled={
            status === "submitting" ||
            !hasValidBody ||
            !hasValidTitle ||
            !allImagesCompressed ||
            !hasModifiedPost
          }
        />
      </ScrollView>
    </CustomHeader>
  );
};
export default EditPost;
