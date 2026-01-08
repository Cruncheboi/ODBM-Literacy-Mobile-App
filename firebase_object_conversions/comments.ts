import { auth, Comment, CommentFromFirestore } from "@/firebaseConfig";
import { DocumentSnapshot, serverTimestamp } from "firebase/firestore";

export class CommentConverter {
  static converter = {
    toFirestore: (postID: string, body: string) => {
      const currentUser = auth.currentUser;
      if (currentUser == null) {
        console.log(
          "Could not convert data for use in Firestore because user is not authenticated."
        );
        return;
      }

      return {
        postID: postID,
        displayName: currentUser.displayName,
        user: currentUser.uid,
        date: serverTimestamp(),
        body: body,
      };
    },
    fromFirestore: (snapshot: DocumentSnapshot): Comment => {
      const data = snapshot.data() as CommentFromFirestore;
      return {
        documentID: snapshot.id,
        displayName: data.displayName,
        user: data.user,
        date: data.date.toDate().toISOString(),
        body: data.body,
        postID: data.postID,
      };
    },
  };
}
