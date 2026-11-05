export interface ImageInfo {
  id: number;
  url: string;
  order: number;
}

export interface ImageUpdate {
  imagesToInsert?: ImageInfo[];
  imagesToDelete?: number[]; // List of image ids
}

export interface ImageCreation {
  uploadUrl: string;
  publicDownloadUrl: string;
  b2FileId: string;
}

export interface CompressedImagePayload {
  localAssetId: string;
  uri: string;
  name: string;
  type: string;
  isCompressing: boolean;
}

export interface PickedImagePayload {
  uri: string;
  width: number;
  height: number;
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB upload limit
export const MAX_PHOTOS_LIMIT = 5;
