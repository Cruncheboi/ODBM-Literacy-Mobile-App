import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

export interface LocalAssetRecord {
  localAssetId: string; // Immutable native system asset unique identifier string
  uri: string; // Local file pointer path string
  width: number;
  height: number;
  creationTime: number;
}

/**
 * High-Performance Image Roll Indexer
 * Fetches the user's latest camera roll images using flat metadata objects.
 */
export const fetchCameraRollImagesInfo = async (
  limit = 40,
  afterAssetId?: string,
): Promise<{
  endCursor?: string;
  hasNextPage: boolean;
  assets: LocalAssetRecord[];
}> => {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync(false, [
      "photo",
    ]);

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Gallery permissions are required to display photo selectors.",
      );
      return { endCursor: undefined, hasNextPage: true, assets: [] };
    }

    // Query system directories using lightning-fast metadata paging filters
    const mediaPage = await MediaLibrary.getAssetsAsync({
      first: limit,
      after: afterAssetId,
      mediaType: ["photo"],
      sortBy: [MediaLibrary.SortBy.creationTime], // Sort by newest photos first
    });

    const assets = mediaPage.assets.map((asset) => ({
      localAssetId: asset.id,
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      creationTime: asset.creationTime,
    }));

    const { endCursor, hasNextPage } = mediaPage;

    return { endCursor, hasNextPage, assets };
  } catch (error) {
    console.error("Camera roll index tracking failed:", error);
    return { endCursor: undefined, hasNextPage: true, assets: [] };
  }
};
