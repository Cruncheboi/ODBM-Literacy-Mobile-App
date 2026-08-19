import { FirebaseError, initializeApp } from "firebase/app";
import {
  initializeAuth,
  onAuthStateChanged,
  getReactNativePersistence,
} from "firebase/auth";
import {
  collection,
  FieldValue,
  FirestoreErrorCode,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADn1yiGNpgh7tm0JDuYabRmmOvneYtpJE",
  authDomain: "odbm-literacy.firebaseapp.com",
  projectId: "odbm-literacy",
  storageBucket: "odbm-literacy.firebasestorage.app",
  messagingSenderId: "1062195528498",
  appId: "1:1062195528498:web:ff54dcbb364a6459f1cd2b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);

export const isSignedIn = (): boolean => {
  let userSignedIn = false;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userSignedIn = true;
    }
  });
  return userSignedIn;
};

// Path constants in firestore
export const usersPath = "users";
export const testimoniesPath = "testimonies";
export const eventsPath = "events";
export const commentsPath = "comments";
export const reportsPath = "reports";

// Collection constants in firestore
export const usersCollection = collection(db, usersPath);
export const testimoniesCollection = collection(db, testimoniesPath);
export const eventsCollection = collection(db, eventsPath);
export const commentsCollection = collection(db, commentsPath);
export const reportsCollection = collection(db, reportsPath);

export type Post = Testimony | Event;
export type PostType = "testimony" | "event";
export type Content = Post | Comment;
export type ContentType = PostType | "comment";
export type ReportReason = "spam" | "harassment" | "hate speech";
export type Status = "pending" | "resolved";

export interface UserInfo {
  displayName: string;
  displayNameLowerCase: string;
  firstName: string;
  lastName: string;
  certificatesCompleted: {
    facilitator: boolean;
    learner: boolean;
  };
  blockedUserIds: string[];
}

export interface Testimony {
  contentType: "testimony";
  documentId: string;
  displayName: string;
  user: string;
  date: string;
  title: string;
  body: string;
  reports: number;
}

export interface TestimonyFromFirestore {
  displayName: string;
  user: string;
  date: Timestamp;
  title: string;
  body: string;
  reports: number;
}

export interface TestimonyUpdateFields {
  title: string;
  body: string;
}

export interface Event {
  contentType: "event";
  documentId: string;
  displayName: string;
  user: string;
  date: string;
  title: string;
  body: string;
  reports: number;
}

export interface EventFromFirestore {
  displayName: string;
  user: string;
  date: Timestamp;
  title: string;
  body: string;
  reports: number;
}

export interface EventUpdateFields {
  title: string;
  body: string;
}

export interface Comment {
  contentType: "comment";
  documentId: string;
  postID: string;
  postType: PostType;
  displayName: string;
  user: string;
  date: string;
  body: string;
  reports: number;
}

export interface CommentFromFirestore {
  postID: string;
  postType: PostType;
  displayName: string;
  user: string;
  date: Timestamp;
  body: string;
  reports: number;
}

export interface CommentUpdateFields {
  body: string;
}

export interface Report {
  postId: string;
  documentId: string;
  reporterUid: string;
  displayName: string;
  contentType: ContentType;
  reason: ReportReason;
  explanation: string;
  date: string;
}

export interface ReportFromFirestore {
  postId: string;
  reporterUid: string;
  displayName: string;
  contentType: ContentType;
  reason: ReportReason;
  explanation: string;
  date: Timestamp;
}

export interface ReportToFirestore {
  postId: string;
  reporterUid: string;
  displayName: string;
  contentType: ContentType;
  reason: ReportReason;
  explanation: string;
  date: FieldValue;
}

export const getCollection = (contentType: ContentType) => {
  if (contentType === "testimony") {
    return testimoniesCollection;
  } else if (contentType === "event") {
    return eventsCollection;
  } else {
    return commentsCollection;
  }
};

export const genericFirestoreErrorLog = (error: any) => {
  if (error instanceof FirebaseError) {
    console.error("Firebase Error:", error.code, error.message);
    if (error.code === ("permission-denied" satisfies FirestoreErrorCode)) {
      console.error("User does not have permission to access this collection.");
      Toast.show({
        type: "error",
        text1: "You do not have the permissions to complete this action.",
      });
    } else if (error.code === ("unavailable" satisfies FirestoreErrorCode)) {
      console.error("Firestore service is currently unavailable.");
      Toast.show({
        type: "error",
        text1: "Database is currently unavailable. Please try again later.",
      });
    }
  } else if (error.code === ("unauthenticated" satisfies FirestoreErrorCode)) {
    console.error("Firestore service is currently unavailable.");
    Toast.show({
      type: "error",
      text1: "You are currently not authenticaed.",
      text2: "Please log in.",
    });
  } else {
    console.error("Unexpected Error:", error);
    Toast.show({
      type: "error",
      text1: "An unexpected error occurred.",
    });
  }
};
