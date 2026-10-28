import { MasterPostRecord } from "@/definitions/posts";
import { databaseApi } from "../databaseApi";

const postsApi = databaseApi.injectEndpoints({
  endpoints: (builder) => ({
    initializePost: builder.mutation<
      {
        postId: number;
        presignedAssets: { imageId: number; uploadUrl: string }[];
      },
      Pick<MasterPostRecord, "postType" | "title" | "body"> & {
        youtubeUrl?: string | null;
        imageMimeTypes: string[];
      }
    >({
      query: (body) => ({
        url: "posts/initialize",
        method: "POST",
        body,
      }),
    }),
    activatePost: builder.mutation<
      { message: string },
      Pick<MasterPostRecord, "postType" | "postId"> & {
        successfulImageIds: number[];
      }
    >({
      query: ({ postId, ...body }) => ({
        url: `posts/${postId}/activate`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) =>
        arg.postType === "event" ? ["Events"] : ["Testimonies"],
    }),
  }),
  overrideExisting: true,
});

export const { useInitializePostMutation, useActivatePostMutation } = postsApi;
