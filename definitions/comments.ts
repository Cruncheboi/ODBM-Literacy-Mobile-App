export interface MasterCommentRecord {
  commentId: number;
  postId: number;
  timestamp: string;
  authorId: number;
  authorFirebaseUid: string;
  authorName: string;
  body: string;
}

export type CommentType = "comment";

export type CommentPost = MasterCommentRecord & { postType: "comment" };

/**
 * The max length for the body of a comment.
 */
export const COMMENT_CHAR_LIMIT = 1000;
