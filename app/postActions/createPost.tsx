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
import ImageSelector from "@/components/images/imageSelector";
import { CompressedImagePayload } from "@/definitions/media";
import {
  useActivatePostMutation,
  useInitializePostMutation,
} from "@/redux/query_services/injectedEndpoints.ts/posts";

export type CreatePostSearchParams = {
  type: PostType;
};

type Status = "submitting" | "typing";

const CreatePost = () => {
  // Input state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [images, setImages] = useState<CompressedImagePayload[]>([]);

  //Input validation
  const hasValidTitle = title.length > 0 && title.trim() !== "";
  const hasValidBody = body.length > 0 && body.trim() !== "";

  // Post state
  const [status, setStatus] = useState<Status>("typing");
  const { type: postType } = useLocalSearchParams<CreatePostSearchParams>();
  const [hasTouched, setHasTouched] = useState({
    title: false,
    body: false,
  });

  // RTK Query mutations
  const [initializePost] = useInitializePostMutation();
  const [activatePost] = useActivatePostMutation();

  const isEditable = status !== "submitting";

  const onPostSubmit = async () => {
    if (status === "submitting" || !hasValidTitle || !hasValidBody) return;

    setStatus("submitting");
    try {
      /**
       * Initialize Post and get presigned assets
       */
      // Extract mimetypes list from your compressed assets array
      const mimeTypes = images.map((img) => img.type);

      const initResponse = await initializePost({
        postType,
        title,
        body,
        youtubeUrl: postType === "event" ? youtubeUrl : null,
        imageMimeTypes: mimeTypes,
      }).unwrap();

      // Explicit camelCase keys are captured directly with ZERO mapping work
      const { postId, presignedAssets } = initResponse;
      const successfulUploadIds: number[] = [];

      /**
       * Upload images directly to cloud
       */
      if (images.length > 0 && presignedAssets && presignedAssets.length > 0) {
        // Execute uploads sequentially or in parallel.
        // A standard for...of loop ensures stable tracking across mobile threads.
        for (let i = 0; i < images.length; i++) {
          const localImage = images[i];
          const cloudTicket = presignedAssets[i];

          try {
            // Fetch the physical raw file blob out of the phone's local cache URI
            const fileBlobResponse = await fetch(localImage.uri);
            const rawFileBlob = await fileBlobResponse.blob();

            // Stream the binary chunk straight to Backblaze B2
            const cloudUploadResponse = await fetch(cloudTicket.uploadUrl, {
              method: "PUT",
              body: rawFileBlob,
              headers: { "Content-Type": localImage.type },
            });

            if (cloudUploadResponse.ok) {
              // If Backblaze responds 200 OK, track the successful image record primary key ID
              successfulUploadIds.push(cloudTicket.imageId);
            } else {
              console.warn(
                `Direct-to-cloud file drop occurred on asset row ID: ${cloudTicket.imageId}`,
              );
            }
          } catch (fileUploadError) {
            // Individual upload failed (e.g. network blip), log it and allow the loop to continue
            console.error(
              `Network dropped transit on file position index ${i}:`,
              fileUploadError,
            );
          }
        }
      }

      /**
       * Activate post and its content to show up on feeds
       */
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

      // Captures your clean backend error text parameters seamlessly
      const errorMessage =
        workflowException?.data?.error ||
        "A secure network connection could not be established.";
      console.error("Submission Suspended", errorMessage);
    } finally {
      // Release UI interface screen lock inputs
      setStatus("typing");
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
        <ImageSelector images={images} setImages={setImages} />
        <View>
          <CustomOpacityButton
            title="Create Post"
            onPress={onPostSubmit}
            disabled={
              status === "submitting" || !hasValidBody || !hasValidTitle
            }
          />
        </View>
      </ScrollView>
    </CustomHeader>
  );
};
export default CreatePost;
