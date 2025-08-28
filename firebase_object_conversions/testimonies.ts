import { Testimony, TestimonyFromFirestore } from "@/firebaseConfig";
import { DocumentSnapshot, Timestamp } from "firebase/firestore";

export class TestimonyConverter {
  static converter = {
    toFirestore: (testimony: Testimony) => {
      return {
        documentID: testimony.documentID,
        user: testimony.user,
        date: Timestamp.fromDate(testimony.date),
        title: testimony.title,
        body: testimony.body,
      };
    },
    fromFirestore: (snapshot: DocumentSnapshot) => {
      const data = snapshot.data() as TestimonyFromFirestore;
      return {
        documentID: data.documentID,
        user: data.user,
        date: data.date.toDate(),
        title: data.title,
        body: data.body,
      };
    },
  };
}
