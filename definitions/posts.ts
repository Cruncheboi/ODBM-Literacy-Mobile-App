export interface MasterPostRecord {
  postId: number;
  timestamp: string;
  authorId: number;
  authorFirebaseUid: string;
  authorName: string;
  title: string;
  body: string;
  images?: Array<{ id: number; url: string; order: number }> | null;
  // Event specific fields
  youtubeId?: string | null;
}

// These fields appear on every main post in the app
type BasePost = Pick<
  MasterPostRecord,
  | "postId"
  | "timestamp"
  | "authorId"
  | "authorFirebaseUid"
  | "authorName"
  | "title"
  | "body"
  | "images"
>;

export type TestimonyPost = BasePost & { postType: "testimony" };

export type EventPost = BasePost &
  Pick<MasterPostRecord, "youtubeId"> & { postType: "event" };

export type PostType = "testimony" | "event";
export type Post = TestimonyPost | EventPost;

/**
 * The max length for the title of a post.
 */
export const TITLE_CHAR_LIMIT = 150;
/**
 * The max length for the body of a post.
 */
export const BODY_CHAR_LIMIT = 3000;
/**
 * The max length of a Youtube URL
 */
export const YT_URL_CHAR_LIMIT = 50;
