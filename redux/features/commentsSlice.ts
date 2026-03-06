import { Comment, PostType } from "@/firebaseConfig";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { current, WritableDraft } from "immer";

export interface Comments {
  [documentId: string]: Comment;
}

interface CommentCollectionData {
  comments: Comments;
  lastDocReached: boolean;
  lastCommentDocID?: string; // The last comment document ID retrieved from Firestore
}

interface CommentCollection {
  [postID: string]: CommentCollectionData;
}

interface CommentsState {
  testimonyComments: CommentCollection;
  eventComments: CommentCollection;
}

const initialState: CommentsState = {
  testimonyComments: {},
  eventComments: {},
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    // Initializes a post's CommentCollectionData with empty values
    initializePostCommentData: (
      state,
      action: PayloadAction<{ postID: string; type: PostType }>,
    ) => {
      const { postID, type } = action.payload;
      const commentCollection = getCommentCollection(type);
      initializeComments(state[commentCollection], postID);
      console.log(`comments: ${state[commentCollection][postID].comments}`);
    },
    // Adds a list of new comments and updates the last comment document ID retrieved from Firestore.
    addComments: (
      state,
      action: PayloadAction<{
        comments: Comment[];
        lastCommentDocID?: string;
        type: PostType;
        lastDocReached: boolean;
      }>,
    ) => {
      const { comments, lastCommentDocID, type, lastDocReached } =
        action.payload;
      const commentCollection = getCommentCollection(type);
      if (comments.length == 0) return;
      const postID = comments[0].postID;
      initializeComments(state[commentCollection], postID);
      // Convert new comments from an array to an object dictionary
      const newCommments = comments.reduce((acc: Comments, comment) => {
        acc[comment.documentId] = comment;
        return acc;
      }, {});

      // Combine new and existing comments
      state[commentCollection][postID].comments = {
        ...state[commentCollection][postID].comments,
        ...newCommments,
      };

      // Update comment data state
      state[commentCollection][postID].lastDocReached = lastDocReached;
      state[commentCollection][postID].lastCommentDocID = lastCommentDocID;
    },
    // Appends a given comment to the start of the object
    appendCommentToStart: (
      state,
      action: PayloadAction<{
        comment: Comment;
        type: PostType;
      }>,
    ) => {
      const { comment, type } = action.payload;
      const commentCollection = getCommentCollection(type);
      initializeComments(state[commentCollection], comment.postID);
      state[commentCollection][comment.postID].comments = {
        comment,
        ...state[commentCollection][comment.postID].comments,
      };
    },
    resetAllComments: () => initialState,
    // Resets the comment data of a specific post using their postID
    resetCommentsOfAPost: (
      state,
      action: PayloadAction<{ postID: string; type: PostType }>,
    ) => {
      const { postID, type } = action.payload;
      const commentCollection = getCommentCollection(type);
      state[commentCollection][postID].comments = {};
      state[commentCollection][postID].lastCommentDocID = undefined;
      state[commentCollection][postID].lastDocReached = false;
    },
    resetCommentCollection: (
      state,
      action: PayloadAction<{ type: PostType }>,
    ) => {
      const { type } = action.payload;
      // let commentCollection = getCommentCollection(type);
      const commentCollection = getCommentCollection(type);
      console.log(state.testimonyComments);
      state[commentCollection] = {};
      console.log(state.testimonyComments);
    },
    logCommentObjects: (state) => {
      console.log(`Comment State: ${state}`);
      console.log(
        `Testimony Comments: ${state.testimonyComments} with ${Object.keys(state.testimonyComments).length}`,
      );
      console.log(
        `Event Comments: ${state.eventComments} with ${Object.keys(state.eventComments).length}`,
      );
    },
  },
});

const initializeComments = (
  commentCollection: WritableDraft<CommentCollection>,
  postID: string,
) => {
  if (commentCollection[postID] == undefined) {
    commentCollection[postID] = {
      comments: {},
      lastDocReached: false,
      lastCommentDocID: undefined,
    };
  }
};

export const getCommentCollection = (postType: PostType) => {
  if (postType === "testimony") {
    return "testimonyComments";
  } else {
    return "eventComments";
  }
};

export const {
  initializePostCommentData,
  addComments,
  appendCommentToStart,
  resetAllComments,
  resetCommentsOfAPost,
  resetCommentCollection,
  logCommentObjects,
} = commentsSlice.actions;
export default commentsSlice.reducer;
