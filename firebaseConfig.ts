import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  onAuthStateChanged,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

export interface UserInfo {
  firstName: string;
  lastName: string;
  certificatesCompleted: {
    facilitator: boolean;
    learner: boolean;
  };
}
