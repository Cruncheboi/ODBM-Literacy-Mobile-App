import { TestimonyConverter } from "@/firebase_object_conversions/testimonies";
import {
  genericFirestoreErrorLog,
  testimoniesCollection,
  Testimony,
  TestimonyUpdateFields,
} from "@/firebaseConfig";
import { BasicStartAfterFieldValues } from "@/redux/services/firestore";
import {
  addDoc,
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
  updateDoc,
} from "firebase/firestore";
import { QUERY_LIMIT } from "./firebaseFunctions";
import Toast from "react-native-toast-message";

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
    genericFirestoreErrorLog(error);
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
    genericFirestoreErrorLog(error);
    return [];
  }
};

export const updateTestimony = async (
  documentId: string,
  updatedFields: TestimonyUpdateFields,
): Promise<boolean> => {
  const { body, title } = updatedFields;
  if (body.trim() === "" || title.trim() === "") {
    return false;
  }

  try {
    const testimonyDoc = doc(testimoniesCollection, documentId);
    await updateDoc(testimonyDoc, { ...updatedFields });
    return true;
  } catch (error) {
    genericFirestoreErrorLog(error);
    return false;
  }
};

/**
 * Creates a new Testimony document in Firebase Firestore.
 * @returns A newly created Testimony.
 */
export const createTestimony = async (
  title: string,
  body: string,
): Promise<Testimony | null> => {
  title = title.trim();
  body = body.trim();

  if (body === "" || title === "") return null;

  console.log("Creating post");

  const firestoreTestimony = TestimonyConverter.converter.toFirestore(
    title,
    body,
  );

  try {
    if (!firestoreTestimony) {
      throw "unauthenticated" satisfies FirestoreErrorCode;
    }
    let docRef = await addDoc(testimoniesCollection, firestoreTestimony);

    const testimony: Testimony = {
      ...firestoreTestimony,
      contentType: "testimony",
      documentId: docRef.id,
      date: new Date().toISOString(),
    };

    Toast.show({
      type: "success",
      text1: "Post submitted successfully.",
    });
    return testimony;
  } catch (error) {
    genericFirestoreErrorLog(error);
  }

  return null;
};
