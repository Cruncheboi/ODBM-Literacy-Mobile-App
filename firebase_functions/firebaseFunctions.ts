import { CreatePostSearchParams } from "@/app/postActions/createPost";
import { CommentConverter } from "@/firebase_object_conversions/comments";
import { TestimonyConverter } from "@/firebase_object_conversions/testimonies";
import { EventConverter } from "@/firebase_object_conversions/events";

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
  Comment,
  commentsCollection,
  Report,
  reportsCollection,
  ContentType,
} from "@/firebaseConfig";
import { FirebaseError } from "firebase/app";
import {
  addDoc,
  doc,
  documentId,
  FirestoreError,
  FirestoreErrorCode,
  getDoc,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { ReportConverter } from "@/firebase_object_conversions/reports";
import { ReportQueryFieldValues } from "@/redux/services/injectedEndpoints.ts/reports";
import { BasicStartAfterFieldValues } from "@/redux/services/firestore";

/**
 * @description The maximum number of document to be retreived from a query.
 */
export const QUERY_LIMIT = 15;

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
  console.error("Failed to retrieve user info from database.");
  return null;
};

export const checkIfDisplayNameIsAvailable = async (
  displayName: string,
): Promise<boolean> => {
  const q = query(
    usersCollection,
    where("displayNameLowerCase", "==", displayName.toLowerCase()),
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
 * @returns A tuple that contains a list of Testimony objects and the
 *          QueryDocumentSnapshot of the last Testimony document retrieved.
 */
export const getTestimonies = async (
  lastVisibleDoc?: QueryDocumentSnapshot,
  startAfterFieldValues?: BasicStartAfterFieldValues,
): Promise<[Testimony[], QueryDocumentSnapshot?]> => {
  let q: Query;
  // const startAfterFieldValues = lastVisibleDoc ?? startAfterDoc;
  console.log(`last visible doc: ${lastVisibleDoc?.id}`);
  if (!lastVisibleDoc && !startAfterFieldValues) {
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
      lastVisibleDoc,
      startAfterFieldValues?.date,
      startAfterFieldValues?.documentId,
    );
    if (startAfterFieldValues) {
      const timestamp = Timestamp.fromDate(
        new Date(startAfterFieldValues.date),
      );
      q = query(
        testimoniesCollection,
        orderBy("date", "desc"),
        orderBy(documentId()),
        startAfter(timestamp, startAfterFieldValues.documentId),
        limit(QUERY_LIMIT),
      );
    } else {
      q = query(
        testimoniesCollection,
        orderBy("date", "desc"),
        orderBy(documentId()),
        startAfter(lastVisibleDoc),
        limit(QUERY_LIMIT),
      );
    }
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
    console.log(`new last visible doc: ${lastVisibleDoc?.id}`);
    return [testimonies, lastVisibleDoc];
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
    return [[], lastVisibleDoc];
  }
};
// /**
//  * Retrieves the most recent testimonies with a specified limit
//  * @returns A tuple that contains a list of Testimony objects and the
//  *          QueryDocumentSnapshot of the last Testimony document retrieved.
//  */
// export const getTestimonies = async (
//   lastVisibleDoc?: QueryDocumentSnapshot,
// ): Promise<[Testimony[], QueryDocumentSnapshot?]> => {
//   let q: Query;
//   console.log(`last visible doc: ${lastVisibleDoc?.id}`);
//   if (lastVisibleDoc == undefined) {
//     console.log("using initial query");
//     // Query to retreive initial testimonies
//     q = query(
//       testimoniesCollection,
//       orderBy("date", "desc"),
//       limit(QUERY_LIMIT),
//     );
//   }
//   // Query to retreive the next testimonies
//   else {
//     console.log("using new query");
//     q = query(
//       testimoniesCollection,
//       orderBy("date", "desc"),
//       limit(QUERY_LIMIT),
//       startAfter(lastVisibleDoc),
//     );
//   }

//   try {
//     const querySnapshot = await getDocs(q);
//     console.log(`Retreived ${querySnapshot.size} testimonies.`);
//     let testimonies: Testimony[] = [];
//     querySnapshot.forEach((doc) => {
//       testimonies.push(TestimonyConverter.converter.fromFirestore(doc));
//     });
//     if (querySnapshot.size > 0) {
//       lastVisibleDoc = querySnapshot.docs[querySnapshot.size - 1];
//     }
//     // console.log(testimonies);
//     console.log(`new last visible doc: ${lastVisibleDoc?.id}`);
//     // console.log(`testimony size: ${testimonies.length}`);
//     return [testimonies, lastVisibleDoc];
//   } catch (error) {
//     if (error instanceof FirebaseError) {
//       console.error("Firebase Error:", error.code, error.message);
//       if (error.code === "permission-denied" satisfies FirestoreErrorCode) {
//         console.error(
//           "User does not have permission to access this collection.",
//         );
//         Toast.show({
//           type: "error",
//           text1: "An error occurred trying to get posts.",
//         });
//       } else if (error.code === "unavailable" satisfies FirestoreErrorCode) {
//         console.error("Firestore service is currently unavailable.");
//         Toast.show({
//           type: "error",
//           text1: "Posts are currently unretrievable. Please try again later.",
//         });
//       }
//     } else {
//       console.error("Unexpected Error:", error);
//       Toast.show({
//         type: "error",
//         text1: "An unexpected error occurred while trying to get posts.",
//       });
//     }
//     return [[], lastVisibleDoc];
//   }
// };

/**
 * Retrieves the most recent events with a specified limit
 * @returns A tuple that contains a list of Event objects and the
 *          QueryDocumentSnapshot of the last Event document retrieved.
 */
export const getEvents = async (
  lastVisibleDoc: QueryDocumentSnapshot | undefined,
): Promise<[Event[], QueryDocumentSnapshot | undefined]> => {
  let q: Query;
  // Query to retreive initial events
  console.log(`last visible doc: ${lastVisibleDoc?.id}`);
  if (lastVisibleDoc == undefined) {
    console.log("using initial query");
    q = query(eventsCollection, orderBy("date", "desc"), limit(QUERY_LIMIT));
  }
  // Query to retreive the next events
  else {
    console.log("using new query");
    q = query(
      eventsCollection,
      orderBy("date", "desc"),
      limit(QUERY_LIMIT),
      startAfter(lastVisibleDoc),
    );
  }

  try {
    const querySnapshot = await getDocs(q);
    console.log(`Retreived ${querySnapshot.size} events.`);
    let events: Event[] = [];
    querySnapshot.forEach((doc) => {
      events.push(EventConverter.converter.fromFirestore(doc));
    });
    if (querySnapshot.size > 0) {
      lastVisibleDoc = querySnapshot.docs[querySnapshot.size - 1];
    }
    // console.log(events);
    console.log(`new last visible doc: ${lastVisibleDoc?.id}`);
    return [events, lastVisibleDoc];
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
    return [[], lastVisibleDoc];
  }
};

/**
 * Retrieves the most recent comments of a specific post with a specified limit
 * @returns A tuple that contains a list of Comment objects and
 *          the DocumentSnapshot of the last Comment document retrieved.
 */
export const getComments = async (
  documentId: string, // Post ID to get comments from
  lastVisibleDoc?: QueryDocumentSnapshot,
  lastVisibleDocID?: string,
): Promise<[Comment[], QueryDocumentSnapshot | undefined]> => {
  // Create a document snapshot to start after in the query.
  // This should only occur when trying to restore the last used document snapshot from a previous session.
  if (lastVisibleDoc == undefined && lastVisibleDocID != undefined) {
    const lastVisibleDocRef = doc(commentsCollection, lastVisibleDocID);
    // lastVisibleDoc = await getDoc(lastVisibleDocRef);
    const restoredDoc = await getDoc(lastVisibleDocRef);
    if (restoredDoc.exists()) {
      lastVisibleDoc = restoredDoc;
    }
  }

  let q: Query;

  // Query to retreive initial comments
  if (lastVisibleDoc == undefined) {
    q = query(
      commentsCollection,
      orderBy("date", "desc"),
      limit(QUERY_LIMIT),
      where("postID", "==", documentId),
    );
    console.log("using initial query");
  }
  // Query to retreive the next comments
  else {
    q = query(
      commentsCollection,
      orderBy("date", "desc"),
      limit(QUERY_LIMIT),
      where("postID", "==", documentId),
      // startAfter(lastVisibleDoc),
      startAfter(""),
    );
    console.log("using new query");
  }

  try {
    const querySnapshot = await getDocs(q);
    console.log(`Retreived ${querySnapshot.size} comments.`);
    let comments: Comment[] = [];

    // Convert retrieved documents into Comment objects and add them to the comments list
    querySnapshot.forEach((doc) => {
      comments.push(CommentConverter.converter.fromFirestore(doc));
    });

    if (querySnapshot.size > 0) {
      lastVisibleDoc = querySnapshot.docs[querySnapshot.size - 1];
    }
    console.log(`new last visible doc: ${lastVisibleDoc?.id}`);
    return [comments, lastVisibleDoc];
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
        text1: "An unexpected error occurred while trying to get comments.",
      });
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
  { type }: CreatePostSearchParams,
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
        TestimonyConverter.converter.toFirestore(title, body),
      );
    } else {
      await addDoc(
        eventsCollection,
        EventConverter.converter.toFirestore(title, body),
      );
    }
    Toast.show({
      type: "success",
      text1: "Post submitted successfully",
    });
  } catch (error) {
    console.log(error);
    submittedSuccessfully = false;
    Toast.show({
      type: "error",
      text1: "An error occurred while creating your post.",
    });
  }

  console.log(submittedSuccessfully);
  return submittedSuccessfully;
};

/**
 * Creates a new Comment document in Firebase Firestore.
 * @returns A copy of the newly created Comment object.
 */
export const createComment = async (
  postID: string,
  body: string,
): Promise<Comment | null> => {
  body = body.trim();
  if (body === "") return null;
  console.log("Creating comment");

  let submittedSuccessfully = true;
  try {
    const currentUser = auth.currentUser;
    if (currentUser == null) return null;
    const docRef = await addDoc(
      commentsCollection,
      CommentConverter.converter.toFirestore(postID, body),
    );
    // Create a duplicate comment to save to local state.
    const newComment: Comment = {
      contentType: "comment",
      body: body,
      date: new Date().toISOString(),
      displayName:
        currentUser.displayName == null ? "Anonymous" : currentUser.displayName,
      documentId: docRef.id,
      postID: postID,
      user: currentUser.uid,
      reports: 0,
    };
    Toast.show({
      type: "success",
      text1: "Comment created successfully.",
    });
    return newComment;
  } catch (error) {
    console.log(error);
    submittedSuccessfully = false;
    Toast.show({
      type: "error",
      text1: "An error occurred while creating your comment.",
    });
    return null;
  }
};
