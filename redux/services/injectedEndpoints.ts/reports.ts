import {
  Comment,
  Content,
  ContentType,
  Event,
  Report,
  Testimony,
} from "@/firebaseConfig";
import {
  BasicStartAfterFieldValues,
  buildError,
  firestoreApi,
  QueryFieldValues,
} from "../firestore";
import {
  getReportedContentFromType,
  getReportsFromUserContent,
} from "@/firebase_functions/reportFunctions";
import { EventConverter } from "@/firebase_object_conversions/events";
import { TestimonyConverter } from "@/firebase_object_conversions/testimonies";
import { CommentConverter } from "@/firebase_object_conversions/comments";
import { FirebaseError } from "firebase/app";

export interface ReportQueryFieldValues extends QueryFieldValues {
  date: string;
  postId: string;
}

export const reportsApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    getReportedEvents: build.infiniteQuery<
      Event[],
      void,
      BasicStartAfterFieldValues | undefined
    >({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          if (lastPage && lastPage.length > 0) {
            const { date, documentId } = lastPage[lastPage.length - 1];
            console.log(date, " ", documentId);
            return { date, documentId };
          }
        },
      },
      queryFn: async ({ pageParam }) => {
        try {
          let startAfterFieldValues: BasicStartAfterFieldValues | undefined;

          if (pageParam) {
            startAfterFieldValues = {
              date: pageParam.date,
              documentId: pageParam.documentId,
            };
          }
          console.log("using: ", startAfterFieldValues);
          const data = await getReportedContentFromType<Event>(
            "event",
            EventConverter.converter.fromFirestore,
            startAfterFieldValues,
          );
          console.log("data: ", data);

          return {
            data: data,
          };
        } catch (error) {
          if (error instanceof FirebaseError) {
            return {
              error: {
                code: error.code,
                message: error.message,
              },
            };
          }

          return { error: "An unknown error occured." };
        }
      },
      providesTags: () => [{ type: "Reported", id: "event" }],
    }),
    getReportedTestimonies: build.infiniteQuery<
      Testimony[],
      void,
      BasicStartAfterFieldValues | undefined
    >({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          if (lastPage && lastPage.length > 0) {
            const { date, documentId } = lastPage[lastPage.length - 1];
            console.log(date, " ", documentId);
            return { date, documentId };
          }
        },
      },
      queryFn: async ({ pageParam }) => {
        try {
          let startAfterFieldValues: BasicStartAfterFieldValues | undefined;

          if (pageParam) {
            startAfterFieldValues = {
              date: pageParam.date,
              documentId: pageParam.documentId,
            };
          }
          console.log("using: ", startAfterFieldValues);
          const data = await getReportedContentFromType<Testimony>(
            "testimony",
            TestimonyConverter.converter.fromFirestore,
            startAfterFieldValues,
          );
          console.log("data: ", data);

          return {
            data: data,
          };
        } catch (error) {
          if (error instanceof FirebaseError) {
            return {
              error: {
                code: error.code,
                message: error.message,
              },
            };
          }

          return { error: "An unknown error occured." };
        }
      },
      providesTags: () => [{ type: "Reported", id: "testimony" }],
    }),
    getReportedComments: build.infiniteQuery<
      Comment[],
      void,
      BasicStartAfterFieldValues | undefined
    >({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          if (lastPage && lastPage.length > 0) {
            const { date, documentId } = lastPage[lastPage.length - 1];
            console.log(date, " ", documentId);
            return { date, documentId };
          }
        },
      },
      queryFn: async ({ pageParam }) => {
        try {
          let startAfterFieldValues: BasicStartAfterFieldValues | undefined;

          if (pageParam) {
            startAfterFieldValues = {
              date: pageParam.date,
              documentId: pageParam.documentId,
            };
          }
          console.log("using: ", startAfterFieldValues);
          const data = await getReportedContentFromType<Comment>(
            "comment",
            CommentConverter.converter.fromFirestore,
            startAfterFieldValues,
          );
          console.log("data: ", data);

          return {
            data: data,
          };
        } catch (error) {
          return buildError(error);
        }
      },
      providesTags: () => [{ type: "Reported", id: "comment" }],
    }),
    getReportsFromUserContent: build.infiniteQuery<
      Report[],
      { contentType: ContentType; reportedPostId: string },
      ReportQueryFieldValues | undefined
    >({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          if (lastPage && lastPage.length > 0) {
            const { date, documentId, postId } = lastPage[lastPage.length - 1];
            console.log(date, " ", documentId);
            return { date, documentId, postId };
          }
        },
      },
      queryFn: async ({ queryArg, pageParam }) => {
        try {
          let startAfterFieldValues: ReportQueryFieldValues | undefined;

          if (pageParam) {
            startAfterFieldValues = {
              date: pageParam.date,
              documentId: pageParam.documentId,
              postId: pageParam.postId,
            };
          }

          console.log("using: ", startAfterFieldValues);
          const data = await getReportsFromUserContent(
            queryArg.contentType,
            queryArg.reportedPostId,
            startAfterFieldValues,
          );
          console.log("data: ", data);

          return {
            data: data,
          };
        } catch (error) {
          return buildError(error);
        }
      },
      providesTags: (result, error, queryArg) => [
        { type: "Report", id: queryArg.contentType },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetReportedEventsInfiniteQuery,
  useGetReportedTestimoniesInfiniteQuery,
  useGetReportedCommentsInfiniteQuery,
  useGetReportsFromUserContentInfiniteQuery,
} = reportsApi;
