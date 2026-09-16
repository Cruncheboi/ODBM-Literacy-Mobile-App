import { CommentPost, CommentType } from "./comments";
import { Post, PostType } from "./posts";

export const BASE_URL = "http://192.168.0.18:3000/api";

export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface KeysetCursor {
  lastTimestamp: string;
  lastId: string;
}

export interface ServerFeedResponse<T> {
  hasMore: boolean;
  data: T[];
}

export type ContentType = PostType | CommentType;

export type Content = Post | CommentPost;
