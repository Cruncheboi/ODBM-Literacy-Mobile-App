import {
  Event,
  eventsCollection,
  EventUpdateFields,
  genericFirestoreErrorLog,
} from "@/firebaseConfig";
import { BasicStartAfterFieldValues } from "@/redux/services/firestore";
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
} from "firebase/firestore";
import { QUERY_LIMIT } from "./firebaseFunctions";
import { EventConverter } from "@/firebase_object_conversions/events";
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
    genericFirestoreErrorLog(error);
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
    genericFirestoreErrorLog(error);
    return null;
  }
};

export const updateEvent = async (
  documentId: string,
  updatedFields: EventUpdateFields,
): Promise<boolean> => {
  const { body, title } = updatedFields;
  if (body.trim() === "" || title.trim() === "") {
    return false;
  }
  Toast.show({
    type: "success",
    text1: "Event updated successfully.",
  });
  try {
    const eventsDoc = doc(eventsCollection, documentId);
    await updateDoc(eventsDoc, { ...updatedFields });
    return true;
  } catch (error) {
    genericFirestoreErrorLog(error);
    return false;
  }
};
