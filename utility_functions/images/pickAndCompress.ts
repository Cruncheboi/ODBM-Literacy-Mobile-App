import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Alert } from "react-native";
import { CompressedImagePayload } from "@/definitions/media";

/**
 * Prompts user camera roll permission configurations and processes
 * multiple compressed file selections smoothly.
 */
export async function pickAndCompressImages(): Promise<
  CompressedImagePayload[]
> {
  try {
    // 1. Force safety request check for media gallery system usage permissions
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "This application requires media gallery storage permissions to upload content images.",
      );
      return [];
    }

    // 2. Open standard platform picker with multiple choices activated
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Explicitly capture image layers only
      allowsMultipleSelection: true, // Enable multiple asset selections
      selectionLimit: 5, // Set a hard layout safety cap
      quality: 1, // Capture full resolution first before optimization manipulation
      orderedSelection: true,
    });

    if (
      pickerResult.canceled ||
      !pickerResult.assets ||
      pickerResult.assets.length === 0
    ) {
      return [];
    }

    const processedImages: CompressedImagePayload[] = [];

    // SEQUENTIAL HARDWARE COMPRESSION SWEEP
    for (const asset of pickerResult.assets) {
      // Compress the image to save storage and bandwidth footprint sizes
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        asset.uri,
        [
          // Option: Resize width dynamically if resolution exceeds 1200px
          { resize: { width: asset.width > 1200 ? 1200 : asset.width } },
        ],
        {
          compress: 0.7, // Target 70% quality compression (Optimal production sweet-spot)
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      // Extract details for standard form file matching payloads
      const fileUri = manipulatedImage.uri;
      const filename = fileUri.split("/").pop() || `upload_${Date.now()}.jpg`;

      processedImages.push({
        uri: fileUri,
        name: filename,
        type: "image/jpeg",
      });
    }

    return processedImages;
  } catch (error) {
    console.error("Failed to process multi-image picker actions:", error);
    Alert.alert(
      "Selection Broken",
      "An internal exception occurred processing system assets.",
    );
    return [];
  }
}
