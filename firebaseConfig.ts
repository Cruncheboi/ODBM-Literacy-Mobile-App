import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  onAuthStateChanged,
  getReactNativePersistence,
} from "firebase/auth";
import { collection, getFirestore, Timestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Collection constants in firestore
export const usersCollection = collection(db, usersPath);
export const testimoniesCollection = collection(db, testimoniesPath);
export const eventsCollection = collection(db, eventsPath);
export const commentsCollection = collection(db, commentsPath);

export type Post = Testimony | Event;

export interface UserInfo {
  displayName: string;
  displayNameLowerCase: string;
  firstName: string;
  lastName: string;
  certificatesCompleted: {
    facilitator: boolean;
    learner: boolean;
  };
}

export interface Testimony {
  postType: "testimony";
  documentID: string;
  displayName: string;
  user: string;
  date: string;
  title: string;
  body: string;
}

export interface TestimonyFromFirestore {
  displayName: string;
  user: string;
  date: Timestamp;
  title: string;
  body: string;
}

export interface Event {
  postType: "event";
  documentID: string;
  displayName: string;
  user: string;
  date: string;
  title: string;
  body: string;
}

export interface EventFromFirestore {
  displayName: string;
  user: string;
  date: Timestamp;
  title: string;
  body: string;
}

export interface Comment {
  documentID: string;
  postID: string;
  displayName: string;
  user: string;
  date: string;
  body: string;
}
export interface CommentFromFirestore {
  postID: string;
  displayName: string;
  user: string;
  date: Timestamp;
  body: string;
}
