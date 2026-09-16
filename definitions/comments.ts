export interface MasterCommentRecord {
  commentId: string;
  postId: string;
  timestamp: string;
  authorId: string;
  authorName: string;
  body: string;
}

export type CommentType = "comment";

export type CommentPost = MasterCommentRecord & { postType: "comment" };

/**
 * The max length for the body of a comment.
 */
export const COMMENT_CHAR_LIMIT = 1000;
