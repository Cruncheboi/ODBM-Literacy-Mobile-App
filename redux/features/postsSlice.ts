import { Event, Testimony } from "@/firebaseConfig";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Testimonies {
  [postID: string]: Testimony;
}

export interface Events {
  [postID: string]: Event;
}

interface PostsState {
  testimonies: Testimonies;
  events: Events;
}

const initialState: PostsState = {
  testimonies: {},
  events: {},
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addTestimonyPosts: (state, action: PayloadAction<Testimony[]>) => {
      if (action.payload.length === 0) return;
      const newTestimonies = action.payload.reduce((acc: Testimonies, item) => {
        acc[item.documentID] = item;
        return acc;
      }, {});
      state.testimonies = {
        ...state.testimonies,
        ...newTestimonies,
      };
    },
    addEventPosts: (state, action: PayloadAction<Event[]>) => {
      if (action.payload.length === 0) return;
      const newEvents = action.payload.reduce((acc: Events, item) => {
        acc[item.documentID] = item;
        return acc;
      }, {});
      state.events = {
        ...state.events,
        ...newEvents,
      };
    },
    testPosts: (state) => {
      console.log(state.testimonies);
      console.log(state.events);
    },
    resetPosts: () => initialState,
    resetTestimonyPosts: (state) => {
      state.testimonies = {};
    },
    resetEventPosts: (state) => {
      state.events = {};
    },
  },
});

export const {
  addTestimonyPosts,
  addEventPosts,
  testPosts,
  resetPosts,
  resetTestimonyPosts,
  resetEventPosts,
} = postsSlice.actions;
export default postsSlice.reducer;
