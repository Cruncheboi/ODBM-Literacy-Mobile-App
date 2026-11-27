import { MasterPostRecord } from "@/definitions/posts";
import { databaseApi } from "../databaseApi";
import { InitializeImageInfo } from "@/definitions/media";

export type PresignedAsset = {
  imageId: number;
  uploadUrl: string;
};

const postsApi = databaseApi.injectEndpoints({
  endpoints: (builder) => ({
    initializePost: builder.mutation<
      {
        postId: number;
        presignedAssets: PresignedAsset[];
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
      invalidatesTags: (result, error, arg) => {
        const singlePostTag = { type: "Post" as const, id: arg.postId };
        return arg.postType === "event"
          ? ["Events", singlePostTag]
          : ["Testimonies", singlePostTag];
      },
    }),
    updatePost: builder.mutation<
      { message: string },
      Pick<MasterPostRecord, "postType" | "postId" | "title" | "body"> & {
        youtubeUrl?: string | null;
        imagesToDelete?: number[];
        successfulNewImageIds?: number[];
        orderedImageIds?: number[];
      }
    >({
      query: ({ postId, postType, ...body }) => ({
        url: `posts/${postId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => {
        const singlePostTag = { type: "Post" as const, id: arg.postId };
        return arg.postType === "event"
          ? ["Events", singlePostTag]
          : ["Testimonies", singlePostTag];
      },
    }),
    presignEditPostImages: builder.mutation<
      { presignedAssets: PresignedAsset[] },
      Pick<MasterPostRecord, "postId"> & {
        contentInfo: InitializeImageInfo[];
        imagesToDeleteCount?: number;
      }
    >({
      query: ({ postId, ...body }) => ({
        url: `posts/${postId}/images/presign`,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useInitializePostMutation,
  useActivatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  usePresignEditPostImagesMutation,
} = postsApi;
