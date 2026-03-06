import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

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
  tagTypes: ["Post", "Testimony", "Event", "Report", "Reported"],
  endpoints: (build) => ({}),
});
