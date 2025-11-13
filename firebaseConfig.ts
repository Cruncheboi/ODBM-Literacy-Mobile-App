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

// Collection and path constants in firestore
export const usersPath = "users";
export const usersCollection = collection(db, usersPath);
export const testimoniesPath = "testimonies";
export const testimoniesCollection = collection(db, testimoniesPath);

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
  documentID: string;
  displayName: string;
  user: string;
  date: Date;
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
