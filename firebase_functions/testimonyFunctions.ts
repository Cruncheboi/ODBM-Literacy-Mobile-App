import { TestimonyConverter } from "@/firebase_object_conversions/testimonies";
import { db, testimoniesCollection, Testimony } from "@/firebaseConfig";
import { BasicStartAfterFieldValues } from "@/redux/services/firestore";
import { FirebaseError } from "firebase/app";
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
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { QUERY_LIMIT } from "./firebaseFunctions";

/**
 * Retrieves the Testimony document with the matching documentId
 * @param documentId Id of the desired document
 */
export const getTestimony = async (
  documentId: string,
): Promise<Testimony | null> => {
  try {
    const docRef = doc(testimoniesCollection, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const testimony = TestimonyConverter.converter.fromFirestore(docSnap);
      return testimony;
    } else {
      console.log("Testimony doc not found.");
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
 * Retrieves the most recent testimonies with a specified limit
 */
export const getTestimonies = async (
  startAfterFieldValues?: BasicStartAfterFieldValues,
): Promise<Testimony[]> => {
  let q: Query;

  if (!startAfterFieldValues) {
    console.log("using initial query");
    // Query to retreive initial testimonies
    q = query(
      testimoniesCollection,
      orderBy("date", "desc"),
      orderBy(documentId()),
      limit(QUERY_LIMIT),
    );
  }
  // Query to retreive the next testimonies
  else {
    console.log(
      "using next query with field values: ",
      startAfterFieldValues?.date,
      startAfterFieldValues?.documentId,
    );
    const timestamp = Timestamp.fromDate(new Date(startAfterFieldValues.date));
    q = query(
      testimoniesCollection,
      orderBy("date", "desc"),
      orderBy(documentId()),
      startAfter(timestamp, startAfterFieldValues.documentId),
      limit(QUERY_LIMIT),
    );
  }

  try {
    const querySnapshot = await getDocs(q);
    console.log(`Retreived ${querySnapshot.size} testimonies.`);
    let testimonies: Testimony[] = [];
    querySnapshot.forEach((doc) => {
      testimonies.push(TestimonyConverter.converter.fromFirestore(doc));
    });

    return testimonies;
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
