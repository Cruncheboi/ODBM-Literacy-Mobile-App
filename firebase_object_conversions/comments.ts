import {
  auth,
  Comment,
  CommentFromFirestore,
  ContentType,
  PostType,
} from "@/firebaseConfig";
import { DocumentSnapshot, serverTimestamp } from "firebase/firestore";

export class CommentConverter {
  static converter = {
    toFirestore: (postID: string, body: string, postType: PostType) => {
      const currentUser = auth.currentUser;
      if (currentUser == null) {
        console.log(
          "Could not convert data for use in Firestore because user is not authenticated.",
        );
        return;
      }

      return {
        postID,
        postType,
        displayName: currentUser.displayName ?? "Anonymous",
        user: currentUser.uid,
        date: serverTimestamp(),
        body: body,
        reports: 0,
      };
    },
    fromFirestore: (snapshot: DocumentSnapshot): Comment => {
      const data = snapshot.data() as CommentFromFirestore;
      return {
        contentType: "comment" satisfies ContentType,
        documentId: snapshot.id,
        displayName: data.displayName,
        user: data.user,
        date: data.date.toDate().toISOString(),
        body: data.body,
        postID: data.postID,
        postType: data.postType,
        reports: data.reports,
      };
    },
  };
}
