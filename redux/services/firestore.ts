import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { FirebaseError } from "firebase/app";

export interface QueryFieldValues {
  documentId: string;
}

export interface BasicStartAfterFieldValues extends QueryFieldValues {
  date: string;
}

export const firestoreApi = createApi({
  reducerPath: "firestoreApi",
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 60,
  tagTypes: [
    "Post",
    "Testimony",
    "Event",
    "Comment",
    "Report",
    "Reported",
    "CommentList",
  ],
  endpoints: (build) => ({}),
});

export const buildError = (error: any) => {
  if (error instanceof FirebaseError) {
    return {
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  return { error: `An unknown error occured. \n${error}` };
};
