import { ImageInfoEditable } from "@/definitions/media";
import { PresignedAsset } from "@/redux/query_services/injectedEndpoints.ts/posts";

/**
 * Sequentially uploads local compressed images directly to Backblaze B2
 * using presigned URLs and returns the array of confirmed database image IDs.
 */
export async function uploadImagesToBackblaze(
  localImages: ImageInfoEditable[],
  presignedAssets: PresignedAsset[],
): Promise<number[]> {
  const successfulUploadIds: number[] = [];

  if (
    localImages.length === 0 ||
    !presignedAssets ||
    presignedAssets.length === 0
  ) {
    return successfulUploadIds;
  }

  for (let i = 0; i < localImages.length; i++) {
    const localImage = localImages[i];
    const cloudTicket = presignedAssets[i];
    if (!cloudTicket) continue;

    try {
      if (localImage.isExisting) continue; // Ensure Image is local
      const fileBlobResponse = await fetch(localImage.uri);
      const rawFileBlob = await fileBlobResponse.blob();

      const cloudUploadResponse = await fetch(cloudTicket.uploadUrl, {
        method: "PUT",
        body: rawFileBlob,
        headers: { "Content-Type": localImage.mimeType },
      });

      if (cloudUploadResponse.ok) {
        successfulUploadIds.push(cloudTicket.imageId);
      } else {
        console.warn(
          `Direct-to-cloud file drop occurred on asset row ID: ${cloudTicket.imageId}`,
        );
      }
    } catch (fileUploadError) {
      console.error(
        `Network dropped transit on file position index ${i}:`,
        fileUploadError,
      );
    }
  }

  return successfulUploadIds;
}
