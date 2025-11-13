/**
 * Contains all code used to sync database and local storage.
 */
import { auth, db, UserInfo, usersPath } from "@/firebaseConfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { AppDispatch } from "./store";
import {
  updateCertificateFacilitator,
  updateCertificateLearner,
  updateDisplayNameLowerCase,
  updateEmail,
  updateFirstName,
  updateLastName,
} from "./features/usersSlice";
import { updateProfile } from "firebase/auth";

/**
 * Updates the first name of the user in the database and locally.
 */
export const updateFirstNameDB = async (
  dispatch: AppDispatch,
  firstName: string
) => {
  await updateDoc(doc(db, usersPath, auth.currentUser!.uid), {
    firstName: firstName,
  })
    // Update user's first name in local storage
    .then(() => {
      dispatch(updateFirstName(firstName));
    })
    .catch((error) => {
      console.log(`First name failed to update in DB. ${error}`);
    });
};

/**
 * Updates the last name of the user in the database and locally.
 */
export const updateLastNameDB = async (
  dispatch: AppDispatch,
  lastName: string
) => {
  await updateDoc(doc(db, usersPath, auth.currentUser!.uid), {
    lastName: lastName,
  })
    // Update user's last name in local storage
    .then(() => {
      dispatch(updateLastName(lastName));
    })
    .catch((error) => {
      console.log(`Last name failed to update in DB. ${error}`);
    });
};

/**
 * Updates the last name of the user in the database and locally.
 */
export const updateDisplayName = async (displayName: string): Promise<void> => {
  if (auth.currentUser == null) {
    console.log(
      "Could not update display since current user is not authenticated."
    );
    return;
  }
  try {
    console.log("updating display name...");
    await updateProfile(auth.currentUser, { displayName: displayName });
  } catch (error) {
    console.log(
      `An error occurred while updating user's display name. ${error}`
    );
  }
};

/**
 * Creates a new account for a user in the database and updates the current user in redux.
 */
export const createUserAccountInfo = (
  dispatch: AppDispatch,
  user: UserInfo
) => {
  if (auth.currentUser == null) return;
  console.log(auth.currentUser);
  setDoc(doc(db, usersPath, auth.currentUser.uid), user)
    // Update local storage with current user info
    .then(() => {
      updateCurrentUserInfo(dispatch, user);
    })
    .catch((error) => {
      console.log(`User info failed to write to DB. ${error}`);
    });
  updateProfile(auth.currentUser, { displayName: user.displayName });
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
  dispatch(updateDisplayNameLowerCase(user.displayNameLowerCase));
  dispatch(
    updateCertificateFacilitator(user.certificatesCompleted.facilitator)
  );
  dispatch(updateCertificateLearner(user.certificatesCompleted.learner));
};
