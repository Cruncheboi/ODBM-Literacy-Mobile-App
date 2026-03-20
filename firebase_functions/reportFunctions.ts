import {
  Content,
  ContentType,
  db,
  genericFirestoreErrorLog,
  getCollection,
  Report,
  ReportReason,
  reportsCollection,
} from "@/firebaseConfig";
import { ReportQueryFieldValues } from "@/redux/services/injectedEndpoints.ts/reports";
import {
  addDoc,
  doc,
  documentId,
  FirestoreErrorCode,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  Query,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { DELETE_LIMIT, QUERY_LIMIT } from "./firebaseFunctions";
import { ReportConverter } from "@/firebase_object_conversions/reports";
import { FirebaseError } from "firebase/app";
import Toast from "react-native-toast-message";
import {
  BasicStartAfterFieldValues,
  QueryFieldValues,
} from "@/redux/services/firestore";

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
    genericFirestoreErrorLog(error);
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
  startAfterFieldValues?: ReportQueryFieldValues,
): Promise<Report[]> => {
  let q: Query;

  if (!startAfterFieldValues) {
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
      startAfterFieldValues?.date,
      startAfterFieldValues?.documentId,
    );
    // Use field values to restore query cursor

    const timestamp = Timestamp.fromDate(new Date(startAfterFieldValues.date));
    q = query(
      reportsCollection,
      where("postId", "==", postId),
      where("contentType", "==", contentType),
      orderBy("date", "desc"),
      orderBy(documentId()),
      startAfter(timestamp, startAfterFieldValues.documentId),
      limit(QUERY_LIMIT),
    );
  }

  try {
    const querySnapshot = await getDocs(q);
    console.log(`Retreived ${querySnapshot.size} reports.`);
    let reports: Report[] = [];

    // Convert retrieved documents into Report objects and add them to the reports list
    querySnapshot.forEach((doc) => {
      reports.push(ReportConverter.converter.fromFirestore(doc));
    });
    return reports;
  } catch (error) {
    genericFirestoreErrorLog(error);
    return [];
  }
};

export const createReport = async (
  documentId: string,
  contentType: ContentType,
  reason: ReportReason,
  explanation: string,
): Promise<boolean> => {
  explanation = explanation.trim();

  console.log("Creating post");
  let submittedSuccessfully = true;
  try {
    await createAndUpdateReportBatch(
      documentId,
      contentType,
      reason,
      explanation,
    );
    Toast.show({
      type: "success",
      text1: "Report submitted successfully.",
    });
  } catch (error) {
    submittedSuccessfully = false;
    genericFirestoreErrorLog(error);
  }

  console.log(submittedSuccessfully);
  return submittedSuccessfully;
};

/**
 * Uses a batch update to keep the number of reports for any given
 * user created content up-to-date when a report is created for it.
 */
const createAndUpdateReportBatch = async (
  documentId: string,
  contentType: ContentType,
  reason: ReportReason,
  explanation: string,
) => {
  const batch = writeBatch(db);

  // Create a new report document
  const reportsDoc = doc(reportsCollection);
  batch.set(
    reportsDoc,
    ReportConverter.converter.toFirestore(
      documentId,
      contentType,
      reason,
      explanation,
    ),
  );

  // Update the number of times this content has been reported by 1.
  const reportedContentDoc = doc(getCollection(contentType), documentId);
  batch.update(reportedContentDoc, { reports: increment(1) });

  await batch.commit();
};

/**
 * Gets the document ids of reports that need to be deleted with a related content.
 * @param postId The document id of the content to be deleted.
 * @returns A tuple with a list of reportIds and
 */
export const getReportDocIdsForDeletion = async (
  postId: string,
  startAfterFieldValues?: QueryFieldValues | null,
): Promise<[string[] | null, QueryFieldValues | null | undefined]> => {
  let q: Query;
  if (!startAfterFieldValues) {
    console.log("using initial query");
    q = query(
      reportsCollection,
      where("postId", "==", postId),
      orderBy(documentId()),
      limit(DELETE_LIMIT),
    );
  }
  // Query to retreive the next related documents
  else {
    console.log(
      "using next query with field values: ",
      startAfterFieldValues.documentId,
    );
    // Use field values to restore query cursor
    q = query(
      reportsCollection,
      where("postId", "==", postId),
      orderBy(documentId()),
      startAfter(startAfterFieldValues.documentId),
      limit(DELETE_LIMIT),
    );
  }

  try {
    const querySnapshot = await getDocs(q);
    const documentIds: string[] = [];

    querySnapshot.forEach((doc) => {
      documentIds.push(doc.id);
    });
    let lastDocFieldValue: QueryFieldValues | null | undefined;

    // Maximum number of docs retrieved.
    // Mark the last doc to retrieve next documents.
    if (querySnapshot.size == DELETE_LIMIT) {
      lastDocFieldValue = { documentId: documentIds[documentIds.length - 1] };
      // All docs retrieved
    } else {
      lastDocFieldValue = null;
    }
    return [documentIds, lastDocFieldValue];
  } catch (error) {
    genericFirestoreErrorLog(error);
    return [null, null];
  }
};
