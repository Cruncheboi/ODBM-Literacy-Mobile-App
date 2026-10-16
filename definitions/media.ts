export interface ImageInfo {
  imageUrl: string;
  b2FileId: string;
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