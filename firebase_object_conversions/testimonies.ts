import {
  auth,
  Event,
  EventFromFirestore,
  Testimony,
  TestimonyFromFirestore,
} from "@/firebaseConfig";
import { DocumentSnapshot, serverTimestamp } from "firebase/firestore";

export class TestimonyConverter {
  static converter = {
    toFirestore: (title: string, body: string) => {
      const currentUser = auth.currentUser;
      if (currentUser == null) {
        console.log(
          "Could not convert data for use in Firestore because user is not authenticated."
        );
        return;
      }

      return {
        displayName: currentUser.displayName,
        user: currentUser.uid,
        date: serverTimestamp(),
        title: title,
        body: body,
      };
    },
    fromFirestore: (snapshot: DocumentSnapshot): Testimony => {
      const data = snapshot.data() as TestimonyFromFirestore;
      return {
        postType: "testimony",
        documentID: snapshot.id,
        displayName: data.displayName,
        user: data.user,
        date: data.date.toDate().toISOString(),
        title: data.title,
        body: data.body,
      };
    },
  };
}

export class EventsConverter {
  static converter = {
    toFirestore: (title: string, body: string) => {
      const currentUser = auth.currentUser;
      if (currentUser == null) {
        console.log(
          "Could not convert data for use in Firestore because user is not authenticated."
        );
        return;
      }

      return {
        displayName: currentUser.displayName,
        user: currentUser.uid,
        date: serverTimestamp(),
        title: title,
        body: body,
      };
    },
    fromFirestore: (snapshot: DocumentSnapshot): Event => {
      const data = snapshot.data() as EventFromFirestore;
      return {
        postType: "event",
        documentID: snapshot.id,
        displayName: data.displayName,
        user: data.user,
        date: data.date.toDate().toISOString(),
        title: data.title,
        body: data.body,
      };
    },
  };
}
