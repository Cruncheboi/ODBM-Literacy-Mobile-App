import { Event, eventsCollection } from "@/firebaseConfig";
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
} from "firebase/firestore";
import { QUERY_LIMIT } from "./firebaseFunctions";
import { EventConverter } from "@/firebase_object_conversions/events";
import { FirebaseError } from "firebase/app";
import Toast from "react-native-toast-message";

/**
 * Retrieves the most recent events with a specified limit
 * @returns A list of Event objects.
 */
export const getEvents = async (
  startAfterFieldValues?: BasicStartAfterFieldValues,
): Promise<Event[]> => {
  let q: Query;
  if (!startAfterFieldValues) {
    console.log("using initial query");
    // Query to retreive initial events
    q = query(
      eventsCollection,
      orderBy("date", "desc"),
      orderBy(documentId()),
      limit(QUERY_LIMIT),
    );
  }
  // Query to retreive the next events
  else {
    console.log(
      "using next query with field values: ",
      startAfterFieldValues?.date,
      startAfterFieldValues?.documentId,
    );
    const timestamp = Timestamp.fromDate(new Date(startAfterFieldValues.date));
    q = query(
      eventsCollection,
      orderBy("date", "desc"),
      orderBy(documentId()),
      startAfter(timestamp, startAfterFieldValues.documentId),
      limit(QUERY_LIMIT),
    );
  }

  try {
    const querySnapshot = await getDocs(q);
    console.log(`Retreived ${querySnapshot.size} events.`);
    let events: Event[] = [];
    querySnapshot.forEach((doc) => {
      events.push(EventConverter.converter.fromFirestore(doc));
    });
    return events;
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

export const getEvent = async (documentId: string): Promise<Event | null> => {
  try {
    const docRef = doc(eventsCollection, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const event = EventConverter.converter.fromFirestore(docSnap);
      return event;
    } else {
      console.log("Event doc not found.");
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
