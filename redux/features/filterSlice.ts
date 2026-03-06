import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Events, Testimonies } from "./postsSlice";
import { Comments } from "./commentsSlice";

interface UserTestimonies {
  data: Testimonies;
  lastDocReached: boolean;
  lastCommentDocId?: string;
}

interface UserEvents {
  data: Events;
  lastDocReached: boolean;
  lastCommentDocId?: string;
}

interface UserComments {
  data: Comments;
  lastDocReached: boolean;
  lastCommentDocId?: string;
}

interface FilterState {
  userTestimonies: UserTestimonies;
  userEvents: UserEvents;
  userComments: UserComments;
}

const initialState: FilterState = {
  userTestimonies: { data: {}, lastDocReached: false },
  userEvents: { data: {}, lastDocReached: false },
  userComments: { data: {}, lastDocReached: false },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    resetFilter: () => initialState,
  },
});

export const { resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
