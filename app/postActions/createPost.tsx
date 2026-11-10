import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import StyledLabel from "@/components/styledLabel";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { PostType } from "@/definitions/posts";
import {
  StyledBodyInput,
  StyledTitleInput,
  StyledYoutubeUrlInput,
} from "@/components/posts/styledEditPostContent";
import {
  CompressedImagePayload,
  MAX_FILE_SIZE_BYTES,
  MAX_PHOTOS_LIMIT,
} from "@/definitions/media";
import {
  useActivatePostMutation,
  useInitializePostMutation,
} from "@/redux/query_services/injectedEndpoints.ts/posts";
import { ImagePicker } from "@/components/bottom_sheet/media/imagePicker";
import { LocalAssetRecord } from "@/utility_functions/images/mediaLoader";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { File } from "expo-file-system";
import { toast } from "@ncrft/native-toast";

export type CreatePostSearchParams = {
  type: PostType;
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
  const { type: postType } = useLocalSearchParams<CreatePostSearchParams>();
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
      /**
       * Initialize Post and get presigned assets
       */
      const imageMimeTypes = selectedImages.map((img) => img.type);

      const initResponse = await initializePost({
        postType,
        title,
        body,
        youtubeUrl: postType === "event" ? youtubeUrl : null,
        imageMimeTypes,
      }).unwrap();

      const { postId, presignedAssets } = initResponse;
      const successfulUploadIds: number[] = [];

      /**
       * Upload selectedImages directly to cloud
       */
      if (
        selectedImages.length > 0 &&
        presignedAssets &&
        presignedAssets.length > 0
      ) {
        // Upload selectedImages sequentially
        for (let i = 0; i < selectedImages.length; i++) {
          const localImage = selectedImages[i];
          const cloudTicket = presignedAssets[i];

          try {
            // Fetch the physical raw file blob out of the phone's local cache URI
            const fileBlobResponse = await fetch(localImage.uri);
            const rawFileBlob = await fileBlobResponse.blob();
            console.log(cloudTicket.uploadUrl);
            // Stream the binary chunk straight to Backblaze B2
            const cloudUploadResponse = await fetch(cloudTicket.uploadUrl, {
              method: "PUT",
              body: rawFileBlob,
              headers: { "Content-Type": localImage.type },
            });

            console.log(cloudUploadResponse);

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

      const errorMessage =
        workflowException?.data?.error ||
        "A secure network connection could not be established.";
      console.error("Submission Suspended", errorMessage);
    } finally {
      // Release UI interface screen lock inputs
      setStatus("typing");
    }
  };

  //
  const handleToggleAsset = async (tappedAsset: LocalAssetRecord) => {
    const existingIndex = selectedImages.findIndex(
      (item) => item.localAssetId === tappedAsset.localAssetId,
    );

    if (existingIndex !== -1) {
      // Deselection logic
      setSelectedImages((prev) =>
        prev.filter((item) => item.localAssetId !== tappedAsset.localAssetId),
      );
    } else {
      // Apply Selection limit
      if (selectedImages.length >= MAX_PHOTOS_LIMIT) {
        toast.error(`You can attach a maximum of ${MAX_PHOTOS_LIMIT} images.`);
        return;
      }

      const placeholderId = tappedAsset.localAssetId;
      setSelectedImages((prev) => [
        ...prev,
        {
          localAssetId: placeholderId,
          uri: "",
          name: "",
          type: "image/jpeg",
          isCompressing: true,
        },
      ]);

      // Start compression process
      try {
        const targetWidth = tappedAsset.width > 1200 ? 1200 : tappedAsset.width;

        // Create the Object-Oriented context tracker handle
        const manipulatorContext = ImageManipulator.manipulate(tappedAsset.uri);

        // Invoke the async hardware renderer
        const imageRef = await manipulatorContext
          .resize({ width: targetWidth })
          .renderAsync();

        const finalCompressedResult = await imageRef.saveAsync({
          compress: 0.7, // Target 70% quality compression
          format: SaveFormat.JPEG,
        });

        // Enforce production file size boundaries on the compressed file
        const fileInfo = new File(finalCompressedResult.uri).info();
        if (
          fileInfo.exists &&
          fileInfo.size &&
          fileInfo.size > MAX_FILE_SIZE_BYTES
        ) {
          // Toast.show({
          //   text1: "File Too Large",
          //   text2: `An image exceeds our ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB limit even after compression.`,
          //   type: "error",
          // });
          Alert.alert(
            "File Too Large",
            `An image exceeds our ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB limit even after compression.`,
          );
          setSelectedImages((prev) =>
            prev.filter((item) => item.localAssetId !== placeholderId),
          );
          return;
        }

        if (fileInfo.exists) {
          console.log(
            fileInfo.size ? fileInfo.size / (1024 * 1024) : fileInfo.exists,
            fileInfo.size,
          );
        }

        const fileUri = finalCompressedResult.uri;
        const fileName = fileUri.split("/").pop() || `upload_${Date.now()}.jpg`;

        // Append asset directly to the structural order array queue
        setSelectedImages((prev) =>
          prev.map((item) =>
            item.localAssetId === placeholderId
              ? {
                  localAssetId: placeholderId,
                  uri: fileUri,
                  name: fileName,
                  type: "image/jpeg",
                  isCompressing: false,
                }
              : item,
          ),
        );
      } catch (e) {
        console.error("Modern image manipulation processing broke down:", e);
        setSelectedImages((prev) =>
          prev.filter((item) => item.localAssetId !== placeholderId),
        );
        toast.error("Failed to compress selected image.");
      }
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
          onToggleAsset={handleToggleAsset}
        />
        <View>
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
        </View>
      </ScrollView>
    </CustomHeader>
  );
};
export default CreatePost;
