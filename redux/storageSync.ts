/**
 * Contains all code used to sync database and local storage.
 */

import { auth, db, Testimony, UserInfo } from "@/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { AppDispatch } from "./store";
import {
  updateCertificateFacilitator,
  updateCertificateLearner,
  updateEmail,
  updateFirstName,
  updateLastName,
} from "./features/usersSlice";
import { TestimonyConverter } from "@/firebase_object_conversions/testimonies";
// Path to usersPath collection in DB
const usersPath = "users";

/**
 * Updates the first name of the user in the database and locally.
 */
export const setFirstName = (dispatch: AppDispatch, firstName: string) => {
  updateDoc(doc(db, usersPath, auth.currentUser!.uid), {
    firstName: firstName,
  })
    // Update user's first name in local storage
    .then(() => {
      dispatch(updateFirstName(firstName));
    })
    .catch((error) => {
      console.log("First name failed to write to DB. " + error);
    });
};

/**
 * Updates the last name of the user in the database and locally.
 */
export const setLastName = (dispatch: AppDispatch, lastName: string) => {
  updateDoc(doc(db, usersPath, auth.currentUser!.uid), {
    lastName: lastName,
  })
    // Update user's last name in local storage
    .then(() => {
      dispatch(updateLastName(lastName));
    })
    .catch((error) => {
      console.log("Last name failed to write to DB. " + error);
    });
};

/**
 * Creates a new account for a user in the database and updates the current user in redux.
 */
export const createUserAccountInfo = (
  dispatch: AppDispatch,
  user: UserInfo
) => {
  console.log(auth.currentUser);
  setDoc(doc(db, usersPath, auth.currentUser!.uid), user)
    // Update local storage with current user info
    .then(() => {
      updateCurrentUserInfo(dispatch, user);
    })
    .catch((error) => {
      console.log("User info failed to write to DB. " + error);
    });
};

/**
 * Updates the user's current info in redux with async persistent storage.
 */
export const updateCurrentUserInfo = (
  dispatch: AppDispatch,
  user: UserInfo
) => {
  if (auth.currentUser == null) return;
  dispatch(updateEmail(auth.currentUser.email as string));
  dispatch(updateFirstName(user.firstName));
  dispatch(updateLastName(user.lastName));
  dispatch(
    updateCertificateFacilitator(user.certificatesCompleted.facilitator)
  );
  dispatch(updateCertificateLearner(user.certificatesCompleted.learner));
};

/**
 * Retrieves the current user's account info from database.
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

const testimoniesPath = "testimonies";
const testimoniesCollection = collection(db, testimoniesPath);

/**
 * Retrieves the most recent testimonies with a specified limit
 * @returns A tuple that contains a list of Testimony objects and the id of the last Testimony document retrieved.
 */
export const getTestimonies = async (): Promise<
  [Testimony[], string | undefined]
> => {
  const q = query(testimoniesCollection, orderBy("date", "desc"), limit(15));

  const querySnapshot = await getDocs(q);
  let testimonies: Testimony[] = [];
  querySnapshot.forEach((doc) => {
    testimonies.push(TestimonyConverter.converter.fromFirestore(doc));
  });
  let lastVisibleDoc: string | undefined;
  if (querySnapshot.size > 0) {
    lastVisibleDoc = querySnapshot.docs[querySnapshot.size - 1].id;
  }
  console.log(testimonies);
  return [testimonies, lastVisibleDoc];
};
