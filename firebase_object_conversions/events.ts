import { auth, Event, EventFromFirestore } from "@/firebaseConfig";
import { DocumentSnapshot, serverTimestamp } from "firebase/firestore";

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
