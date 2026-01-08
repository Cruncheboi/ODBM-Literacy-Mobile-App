import { Comment } from "@/firebaseConfig";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { WritableDraft } from "immer";

export interface Comments {
  [documentID: string]: Comment;
}

interface PostCommentData {
  comments: Comments;
  lastCommentDocID: string | undefined;
}

interface CommentsState {
  [postID: string]: PostCommentData;
}

const initialState: CommentsState = {};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    // Initializes PostCommentData with empty values
    initializePostComments: (
      state,
      action: PayloadAction<{ postID: string }>
    ) => {
      const postID = action.payload.postID;
      initializeComments(state, postID);
    },
    // Adds a new comment and updates the last comment document ID retrieved from Firestore.
    addComment: (
      state,
      action: PayloadAction<{
        comment: Comment;
        lastCommentDocID: string | undefined;
      }>
    ) => {
      const { comment, lastCommentDocID } = action.payload;
      initializeComments(state, comment.postID);
      state[comment.postID].comments[comment.documentID] = comment;
      state[comment.postID].lastCommentDocID = lastCommentDocID;
    },
    // Adds a new comment and updates the last comment document ID retrieved from Firestore.
    addComments: (
      state,
      action: PayloadAction<{
        comments: Comment[];
        lastCommentDocID: string | undefined;
      }>
    ) => {
      const { comments, lastCommentDocID } = action.payload;

      if (comments.length == 0) return;
      const postID = comments[0].postID;
      initializeComments(state, postID);
      // Convert new comments from an array to an object dictionary
      const newCommments = comments.reduce((acc: Comments, comment) => {
        acc[comment.documentID] = comment;
        return acc;
      }, {});

      // Combine new and existing comments
      state[postID].comments = {
        ...state[postID].comments,
        ...newCommments,
      };

      // Set the last visible comment document
      state[postID].lastCommentDocID = lastCommentDocID;
    },
    // Appends a given comment to the start of the object
    appendCommentToStart: (
      state,
      action: PayloadAction<{
        comment: Comment;
      }>
    ) => {
      const comment = action.payload.comment;
      initializeComments(state, comment.postID);
      state[comment.postID].comments = {
        comment,
        ...state[comment.postID].comments,
      };
    },
    resetAllComments: () => initialState,
    // Resets the comment data of a specific post using their postID
    resetCommentsOfAPost: (
      state,
      action: PayloadAction<{ postID: string }>
    ) => {
      const { postID } = action.payload;
      state[postID].comments = {};
      state[postID].lastCommentDocID = undefined;
    },
  },
});

const initializeComments = (
  state: WritableDraft<CommentsState>,
  postID: string
) => {
  if (state[postID] == undefined) {
    state[postID] = {
      comments: {},
      lastCommentDocID: undefined,
    };
  }
};

export const {
  initializePostComments,
  addComment,
  addComments,
  appendCommentToStart,
  resetAllComments,
  resetCommentsOfAPost,
} = commentsSlice.actions;
export default commentsSlice.reducer;
