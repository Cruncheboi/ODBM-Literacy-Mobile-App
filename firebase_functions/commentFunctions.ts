import { Comment, commentsCollection } from "@/firebaseConfig";
import { BasicStartAfterFieldValues } from "@/redux/services/firestore";
import {
  doc,
  documentId,
  FirestoreErrorCode,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Query,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { QUERY_LIMIT } from "./firebaseFunctions";
import { EventConverter } from "@/firebase_object_conversions/events";
import { FirebaseError } from "firebase/app";
import Toast from "react-native-toast-message";
import { CommentConverter } from "@/firebase_object_conversions/comments";

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
        text1: "An unexpected error occurred while trying to get posts.",
      });
    }
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
        text1: "An unexpected error occurred while trying to get posts.",
      });
    }
    return [];
  }
};
