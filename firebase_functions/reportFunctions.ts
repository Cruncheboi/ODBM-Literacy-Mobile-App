import {
  Content,
  ContentType,
  getCollection,
  Report,
  reportsCollection,
} from "@/firebaseConfig";
import { ReportQueryFieldValues } from "@/redux/services/injectedEndpoints.ts/reports";
import {
  documentId,
  FirestoreErrorCode,
  getDocs,
  limit,
  orderBy,
  query,
  Query,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { QUERY_LIMIT } from "./firebaseFunctions";
import { ReportConverter } from "@/firebase_object_conversions/reports";
import { FirebaseError } from "firebase/app";
import Toast from "react-native-toast-message";
import { BasicStartAfterFieldValues } from "@/redux/services/firestore";

export const REPORT_THRESHOLD = 1;

/**
 * Retrieves the most recent reports of a content type with a specified limit
 * @returns A list of Report objects
 */
export const getReportedContentFromType = async <T extends Content>(
  contentType: ContentType,
  fromFirestoreConverter: (doc: QueryDocumentSnapshot) => T,
  startAfterFieldValues?: BasicStartAfterFieldValues,
) => {
  let q: Query;
  const collection = getCollection(contentType);
  // Query to retreive initial reported content
  if (!startAfterFieldValues) {
    console.log("using initial query");
    q = query(
      collection,
      where("reports", ">=", REPORT_THRESHOLD),
      orderBy("date", "desc"),
      limit(QUERY_LIMIT),
    );
  }
  // Query to retreive the next reported content
  else {
    console.log(
      "using next query with field values: ",
      startAfterFieldValues.date,
      startAfterFieldValues.documentId,
    );
    // Use field values to restore query cursor
    const timestamp = Timestamp.fromDate(new Date(startAfterFieldValues.date));
    q = query(
      collection,
      where("reports", ">=", REPORT_THRESHOLD),
      orderBy("date", "desc"),
      startAfter(timestamp),
      limit(QUERY_LIMIT),
    );
  }

  try {
    const querySnapshot = await getDocs(q);
    console.log(`Retreived ${querySnapshot.size} reported content.`);
    let reportedContent: T[] = [];

    // Convert retrieved documents into Report objects and add them to the reportedContent list
    querySnapshot.forEach((doc) => {
      reportedContent.push(fromFirestoreConverter(doc));
    });

    return reportedContent;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase Error:", error.code, error.message);
      if (error.code === ("permission-denied" satisfies FirestoreErrorCode)) {
        console.error(
          "User does not have permission to access this collection.",
        );
        Toast.show({
          type: "error",
          text1: "An error occurred trying to get posts.",
        });
      } else if (error.code === ("unavailable" satisfies FirestoreErrorCode)) {
        console.error("Firestore service is currently unavailable.");
        Toast.show({
          type: "error",
          text1: "Posts are currently unretrievable. Please try again later.",
        });
      }
    } else {
      console.error("Unexpected Error:", error);
      Toast.show({
        type: "error",
        text1: "An unexpected error occurred while trying to get reports.",
      });
    }
    return [];
  }
};

/**
 * Retrieves the most recent reports of a specific post with a specified limit
 * @returns A tuple that contains a list of Report objects and
 *          the DocumentSnapshot of the last Report document retrieved.
 */
export const getReportsFromUserContent = async (
  contentType: ContentType,
  postId: string, // Post ID to get reports from
  lastVisibleDoc?: QueryDocumentSnapshot,
  startAfterFieldValues?: ReportQueryFieldValues,
): Promise<[Report[], QueryDocumentSnapshot | undefined]> => {
  let q: Query;

  if (!lastVisibleDoc && !startAfterFieldValues) {
    console.log("using initial query");
    // Query to retreive initial reports
    q = query(
      reportsCollection,
      where("postId", "==", postId),
      where("contentType", "==", contentType),
      orderBy("date", "desc"),
      orderBy(documentId()),
      limit(QUERY_LIMIT),
    );
  }
  // Query to retreive the next reports
  else {
    console.log(
      "using next query with field values: ",
      lastVisibleDoc,
      startAfterFieldValues?.date,
      startAfterFieldValues?.documentId,
    );
    // Use field values to restore query cursor
    if (startAfterFieldValues) {
      const timestamp = Timestamp.fromDate(
        new Date(startAfterFieldValues.date),
      );
      q = query(
        reportsCollection,
        where("postId", "==", postId),
        where("contentType", "==", contentType),
        orderBy("date", "desc"),
        orderBy(documentId()),
        startAfter(timestamp, startAfterFieldValues.documentId),
        limit(QUERY_LIMIT),
      );
      // Use document snapshot to restore query cursor
    } else {
      q = query(
        reportsCollection,
        where("postId", "==", postId),
        where("contentType", "==", contentType),
        orderBy("date", "desc"),
        orderBy(documentId()),
        startAfter(lastVisibleDoc),
        limit(QUERY_LIMIT),
      );
    }
  }

  try {
    const querySnapshot = await getDocs(q);
    console.log(`Retreived ${querySnapshot.size} reports.`);
    let reports: Report[] = [];

    // Convert retrieved documents into Report objects and add them to the reports list
    querySnapshot.forEach((doc) => {
      reports.push(ReportConverter.converter.fromFirestore(doc));
    });

    if (querySnapshot.size > 0) {
      lastVisibleDoc = querySnapshot.docs[querySnapshot.size - 1];
    }
    console.log(`new last visible doc: ${lastVisibleDoc?.id}`);
    return [reports, lastVisibleDoc];
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase Error:", error.code, error.message);
      if (error.code === ("permission-denied" satisfies FirestoreErrorCode)) {
        console.error(
          "User does not have permission to access this collection.",
        );
        Toast.show({
          type: "error",
          text1: "An error occurred trying to get posts.",
        });
      } else if (error.code === ("unavailable" satisfies FirestoreErrorCode)) {
        console.error("Firestore service is currently unavailable.");
        Toast.show({
          type: "error",
          text1: "Posts are currently unretrievable. Please try again later.",
        });
      }
    } else {
      console.error("Unexpected Error:", error);
      Toast.show({
        type: "error",
        text1: "An unexpected error occurred while trying to get reports.",
      });
    }
    return [[], lastVisibleDoc];
  }
};
