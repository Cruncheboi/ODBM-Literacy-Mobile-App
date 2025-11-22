import { PostSearchParams } from "@/app/(tabs)/impacts/createPost";
import {
  EventsConverter,
  TestimonyConverter,
} from "@/firebase_object_conversions/testimonies";
import {
  auth,
  db,
  Event,
  eventsCollection,
  testimoniesCollection,
  Testimony,
  UserInfo,
  usersCollection,
  usersPath,
} from "@/firebaseConfig";
import { FirebaseError } from "firebase/app";
import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import Toast from "react-native-toast-message";

export const checkIfDisplayNameIsAvailable = async (
  displayName: string
): Promise<boolean> => {
  const q = query(
    usersCollection,
    where("displayNameLowerCase", "==", displayName.toLowerCase())
  );
  console.log("before");
  try {
    const querySnapshot = await getDocs(q);
    console.log("after");
    console.log(querySnapshot.size);
    if (querySnapshot.empty) {
      return true;
    }
    console.log(querySnapshot.docs[0].data);
  } catch (error) {
    console.log(error);
  }

  return false;
};

/**
 * Retrieves the most recent testimonies with a specified limit
 * @returns A tuple that contains a list of Testimony objects and the id of the last Testimony document retrieved.
 */
export const getTestimonies = async (
  lastVisibleDoc: QueryDocumentSnapshot | undefined = undefined
): Promise<[Testimony[], QueryDocumentSnapshot | undefined]> => {
  let q: Query;
  // Query to retreive initial testimonies
  console.log(lastVisibleDoc);
  if (lastVisibleDoc == undefined) {
    console.log("using initial query");
    q = query(testimoniesCollection, orderBy("date", "desc"), limit(15));
  }
  // Query to retreive the next testimonies
  else {
    console.log("using new query");
    q = query(
      testimoniesCollection,
      orderBy("date", "desc"),
      limit(15),
      startAfter(lastVisibleDoc)
    );
  }

  try {
    const querySnapshot = await getDocs(q);
    console.log(`Retreived ${querySnapshot.size} testimonies.`);
    let testimonies: Testimony[] = [];
    querySnapshot.forEach((doc) => {
      testimonies.push(TestimonyConverter.converter.fromFirestore(doc));
    });
    if (querySnapshot.size > 0) {
      lastVisibleDoc = querySnapshot.docs[querySnapshot.size - 1];
    }
    console.log(testimonies);
    console.log(`last visible doc: ${lastVisibleDoc?.id}`);
    console.log(`testimony size: ${testimonies.length}`);
    return [testimonies, lastVisibleDoc];
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase Error:", error.code, error.message);
      if (error.code === "permission-denied") {
        console.error(
          "User does not have permission to access this collection."
        );
        Toast.show({
          type: "error",
          text1: "An error occurred trying to get posts.",
        });
      } else if (error.code === "unavailable") {
        console.error("Firestore service is currently unavailable.");
        Toast.show({
          type: "error",
          text1: "Post are currently unretrievable. Please try again later.",
        });
      }
    } else {
      console.error("Unexpected Error:", error);
    }
    return [[], lastVisibleDoc];
  }
};

/**
 * Retrieves the most recent events with a specified limit
 * @returns A tuple that contains a list of Event objects and the id of the last Event document retrieved.
 */
export const getEvents = async (
  lastVisibleDoc: QueryDocumentSnapshot | undefined = undefined
): Promise<[Event[], QueryDocumentSnapshot | undefined]> => {
  let q: Query;
  // Query to retreive initial events
  console.log(lastVisibleDoc);
  if (lastVisibleDoc == undefined) {
    console.log("using initial query");
    q = query(eventsCollection, orderBy("date", "desc"), limit(15));
  }
  // Query to retreive the next events
  else {
    console.log("using new query");
    q = query(
      eventsCollection,
      orderBy("date", "desc"),
      limit(15),
      startAfter(lastVisibleDoc)
    );
  }

  try {
    const querySnapshot = await getDocs(q);
    console.log(`Retreived ${querySnapshot.size} events.`);
    let events: Event[] = [];
    querySnapshot.forEach((doc) => {
      events.push(EventsConverter.converter.fromFirestore(doc));
    });
    if (querySnapshot.size > 0) {
      lastVisibleDoc = querySnapshot.docs[querySnapshot.size - 1];
    }
    console.log(events);
    console.log(`last visible doc: ${lastVisibleDoc?.id}`);
    return [events, lastVisibleDoc];
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase Error:", error.code, error.message);
      if (error.code === "permission-denied") {
        console.error(
          "User does not have permission to access this collection."
        );
        Toast.show({
          type: "error",
          text1: "An error occurred trying to get posts.",
        });
      } else if (error.code === "unavailable") {
        console.error("Firestore service is currently unavailable.");
        Toast.show({
          type: "error",
          text1: "Post are currently unretrievable. Please try again later.",
        });
      }
    } else {
      console.error("Unexpected Error:", error);
    }
    return [[], lastVisibleDoc];
  }
};

/**
 * Creates a new Testimony document in Firebase Firestore.
 * @returns A boolean that states if the document was created successfully.
 */
export const createPost = async (
  title: string,
  body: string,
  { type }: PostSearchParams
): Promise<boolean> => {
  title = title.trim();
  body = body.trim();

  if (body === "" || title === "") return false;

  console.log("Creating post");
  let submittedSuccessfully = true;
  try {
    if (type == "testimony") {
      await addDoc(
        testimoniesCollection,
        TestimonyConverter.converter.toFirestore(title, body)
      );
    } else {
      await addDoc(
        eventsCollection,
        EventsConverter.converter.toFirestore(title, body)
      );
    }
    Toast.show({
      type: "success",
      text1: "Post Submitted Successfully",
      position: "bottom",
    });
  } catch (error) {
    console.log(error);
    submittedSuccessfully = false;
    Toast.show({
      type: "error",
      text1: "Error Submitting Post",
      position: "bottom",
    });
  }

  console.log(submittedSuccessfully);
  return submittedSuccessfully;
};

/**
 * Retrieves the current user's account info from database.
 * @returns The information of the current user if they are authenticated. Otherwise, returns null.
 */
export const getCurrentUserInfo = async (): Promise<UserInfo | null> => {
  if (auth.currentUser == null) return null;
  const userRef = doc(db, usersPath, auth.currentUser.uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserInfo;
  }
  // Failed to retrieve user info
  console.log("Failed to retrieve user info from database.");
  return null;
};
