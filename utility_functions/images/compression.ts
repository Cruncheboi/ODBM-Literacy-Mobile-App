import {
  ImageInfoEditable,
  MAX_FILE_SIZE_BYTES,
  MAX_PHOTOS_LIMIT,
} from "@/definitions/media";
import { toast } from "@ncrft/native-toast";
import { File } from "expo-file-system";
import { Image } from "expo-image";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { Alert } from "react-native";
import { LocalAssetRecord } from "./mediaLoader";
import { formatFileSize } from "./converter";

/**
 * Handles asset selection logic and compresses an asset when selected.
 */
export const selectAndCompress = async (
  tappedAsset: LocalAssetRecord,
  selectedImages: ImageInfoEditable[],
  setSelectedImages: (value: React.SetStateAction<ImageInfoEditable[]>) => void,
) => {
  const existingIndex = selectedImages.findIndex(
    (item) =>
      !item.isExisting && item.localAssetId === tappedAsset.localAssetId,
  );

  if (existingIndex !== -1) {
    // Deselection logic
    setSelectedImages((prev) =>
      prev.filter(
        (item) =>
          item.isExisting ||
          (!item.isExisting && item.localAssetId !== tappedAsset.localAssetId),
      ),
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
        isExisting: false,
        localAssetId: placeholderId,
        uri: "",
        name: "",
        mimeType: "image/jpeg",
        height: 0,
        width: 0,
        contentLength: 0,
        imageHash: "",
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
        Alert.alert(
          "File Too Large",
          `An image exceeds our ${formatFileSize(MAX_FILE_SIZE_BYTES)} limit even after compression.`,
        );
        setSelectedImages((prev) =>
          prev.filter(
            (item) =>
              item.isExisting ||
              (!item.isExisting && item.localAssetId !== placeholderId),
          ),
        );
        return;
      }

      if (fileInfo.exists) {
        console.log(
          fileInfo.size ? fileInfo.size / (1024 * 1024) : fileInfo.exists,
          fileInfo.size,
        );
        console.log(
          "Dimensions:",
          finalCompressedResult.height,
          finalCompressedResult.width,
        );
      }

      const fileUri = finalCompressedResult.uri;
      const fileName = fileUri.split("/").pop() || `upload_${Date.now()}.jpg`;
      const thumbhash = await Image.generateThumbhashAsync(fileUri);

      // Append asset directly to the structural order array queue
      setSelectedImages((prev) =>
        prev.map((item) =>
          !item.isExisting && item.localAssetId === placeholderId
            ? {
                isExisting: false,
                localAssetId: placeholderId,
                uri: fileUri,
                name: fileName,
                mimeType: "image/jpeg",
                height: finalCompressedResult.height,
                width: finalCompressedResult.width,
                contentLength: fileInfo.size ?? 0,
                imageHash: thumbhash,
                isCompressing: false,
              }
            : item,
        ),
      );
    } catch (e) {
      console.error("Modern image manipulation processing broke down:", e);
      setSelectedImages((prev) =>
        prev.filter(
          (item) =>
            item.isExisting ||
            (!item.isExisting && item.localAssetId !== placeholderId),
        ),
      );
      toast.error("Failed to compress selected image.");
    }
  }
};
