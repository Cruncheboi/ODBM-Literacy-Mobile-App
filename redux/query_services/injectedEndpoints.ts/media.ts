import { databaseApi } from "../databaseApi";
import { ImageCreation } from "@/definitions/media";

const mediaApi = databaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createImage: builder.mutation<ImageCreation, { contentType: string }>({
      query: (bodyData) => ({
        url: "media/presign",
        method: "POST",
        body: bodyData,
      }),
      invalidatesTags: ["Testimonies", "Events", "Comments"],
    }),
  }),
  overrideExisting: true,
});

export const { useCreateImageMutation } = mediaApi;
