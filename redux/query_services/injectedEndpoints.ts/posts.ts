import { MasterPostRecord } from "@/definitions/posts";
import { databaseApi } from "../databaseApi";
import { InitializeImageInfo } from "@/definitions/media";

const postsApi = databaseApi.injectEndpoints({
  endpoints: (builder) => ({
    initializePost: builder.mutation<
      {
        postId: number;
        presignedAssets: { imageId: number; uploadUrl: string }[];
      },
      Pick<MasterPostRecord, "postType" | "title" | "body"> & {
        youtubeUrl?: string | null;
        contentInfo: InitializeImageInfo[];
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
    deletePost: builder.mutation<
      { message: string },
      Pick<MasterPostRecord, "postType" | "postId">
    >({
      query: ({ postId }) => ({
        url: `posts/${postId}/delete`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, arg) =>
        arg.postType === "event" ? ["Events"] : ["Testimonies"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useInitializePostMutation,
  useActivatePostMutation,
  useDeletePostMutation,
} = postsApi;
