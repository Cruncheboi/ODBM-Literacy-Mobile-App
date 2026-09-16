import { BASE_URL } from "@/definitions/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuth } from "firebase/auth";

export const databaseApi = createApi({
  reducerPath: "databaseApi",
  keepUnusedDataFor: 1,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers) => {
      // Injects verified Firebase Bearer token into every single request
      const auth = getAuth();
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Post",
    "Testimonies",
    "Testimony",
    "Events",
    "Event",
    "Comments",
    "Comment",
    "Report",
    "Reported",
    "TestimonyComments",
    "EventComments",
  ],
  endpoints: (builder) => ({}),
});
