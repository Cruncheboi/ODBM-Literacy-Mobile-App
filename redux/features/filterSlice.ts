import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Events, Testimonies } from "./postsSlice";
import { Comments } from "./commentsSlice";

interface UserTestimonies {
  data: Testimonies;
  lastCommentDocId?: string;
}
interface UserEvents {
  data: Events;
  lastCommentDocId?: string;
}
interface UserComments {
  data: Comments;
  lastCommentDocId?: string;
}

interface FilterState {
  userTestimonies: UserTestimonies;
  userEvents: UserEvents;
  userComments: UserComments;
}

const initialState: FilterState = {
  userTestimonies: { data: {} },
  userEvents: { data: {} },
  userComments: { data: {} },
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
