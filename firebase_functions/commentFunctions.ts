import {
  Comment,
  commentsCollection,
  CommentUpdateFields,
  db,
  genericFirestoreErrorLog,
  reportsCollection,
} from "@/firebaseConfig";
import {
  BasicStartAfterFieldValues,
  QueryFieldValues,
} from "@/redux/services/firestore";
import {
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { QUERY_LIMIT } from "./firebaseFunctions";
import Toast from "react-native-toast-message";
import { CommentConverter } from "@/firebase_object_conversions/comments";
import { forIn } from "lodash";
import { getReportDocIdsForDeletion } from "./reportFunctions";

export const getComment = async (
  documentId: string,
): Promise<Comment | null> => {
  try {
    const docRef = doc(commentsCollection, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const comment = CommentConverter.converter.fromFirestore(docSnap);
      return comment;
    } else {
      console.log("Comment doc not found.");
      return null;
    }
  } catch (error) {
    genericFirestoreErrorLog(error);
    return null;
  }
};

/**
 * Retrieves the most recent comments of a post with a specified limit
 * @returns A list of Comment objects.
 */
export const getComments = async (
  postId: string, // Post to retrieve comments from
  startAfterFieldValues?: BasicStartAfterFieldValues,
): Promise<Comment[]> => {
  let q: Query;
  if (!startAfterFieldValues) {
    console.log("using initial query");
    // Query to retreive initial comments
    q = query(
      commentsCollection,
      where("postID", "==", postId),
      orderBy("date", "desc"),
      orderBy(documentId()),
      limit(QUERY_LIMIT),
    );
  }
  // Query to retreive the next comments
  else {
    console.log(
      "using next query with field values: ",
      startAfterFieldValues?.date,
      startAfterFieldValues?.documentId,
    );
    const timestamp = Timestamp.fromDate(new Date(startAfterFieldValues.date));
    q = query(
      commentsCollection,
      where("postID", "==", postId),
      orderBy("date", "desc"),
      orderBy(documentId()),
      startAfter(timestamp, startAfterFieldValues.documentId),
      limit(QUERY_LIMIT),
    );
  }

  try {
    const querySnapshot = await getDocs(q);
    console.log(`Retreived ${querySnapshot.size} comments.`);
    let comments: Comment[] = [];
    querySnapshot.forEach((doc) => {
      comments.push(CommentConverter.converter.fromFirestore(doc));
    });
    return comments;
  } catch (error) {
    genericFirestoreErrorLog(error);
    return [];
  }
};

export const updateComment = async (
  documentId: string,
  updatedFields: CommentUpdateFields,
): Promise<boolean> => {
  const { body } = updatedFields;
  if (body.trim() === "") {
    return false;
  }

  try {
    const commentDoc = doc(commentsCollection, documentId);
    await updateDoc(commentDoc, { ...updatedFields });
    Toast.show({
      type: "success",
      text1: "Comment updated successfully.",
    });
    return true;
  } catch (error) {
    genericFirestoreErrorLog(error);
    return false;
  }
};

/**
 * Delete a comment, along with its related documents such as reports.
 * @returns A boolean whether operation was successful.
 */
export const deleteComment = async (documentId: string): Promise<boolean> => {
  const batch = writeBatch(db);

  // Create a new report document
  const commentDoc = doc(commentsCollection, documentId);
  batch.delete(commentDoc);

  let startAfterFieldValue: QueryFieldValues | null | undefined;
  do {
    // Get Report docs where the reported post was this comment.
    const [reportIds, newFieldValue] = await getReportDocIdsForDeletion(
      documentId,
      startAfterFieldValue,
    );
    startAfterFieldValue = newFieldValue;
    // An error occurred; abort comment deletion.
    if (reportIds == null) {
      console.error("Comment batch delete was aborted.");
      return false;
    }

    // Add a batch delete for each Report doc
    reportIds.forEach((id) => {
      const reportDoc = doc(reportsCollection, id);
      batch.delete(reportDoc);
    });
  } while (startAfterFieldValue);
  try {
    await batch.commit();
    return true;
  } catch (error) {
    genericFirestoreErrorLog(error);
    return false;
  }
};
