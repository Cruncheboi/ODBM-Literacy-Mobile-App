import {
  auth,
  ContentType,
  Report,
  ReportFromFirestore,
  ReportReason,
  ReportToFirestore,
  Status,
} from "@/firebaseConfig";
import { DocumentSnapshot, serverTimestamp } from "firebase/firestore";

export class ReportConverter {
  static converter = {
    toFirestore: (
      postId: string,
      contentType: ContentType,
      reason: ReportReason,
      explanation: string,
      status: Status,
    ): ReportToFirestore | void => {
      const currentUser = auth.currentUser;
      if (currentUser == null) {
        console.log(
          "Could not convert data for use in Firestore because user is not authenticated.",
        );
        return;
      }

      return {
        postId: postId,
        reporterUid: currentUser.uid,
        displayName: currentUser.displayName ?? "",
        contentType: contentType,
        reason: reason,
        explanation: explanation,
        date: serverTimestamp(),
        status: status,
      };
    },
    fromFirestore: (snapshot: DocumentSnapshot): Report => {
      const data = snapshot.data() as ReportFromFirestore;
      return {
        postId: data.postId,
        documentId: snapshot.id,
        reporterUid: data.reporterUid,
        displayName: data.displayName,
        contentType: data.contentType,
        reason: data.reason,
        explanation: data.explanation,
        date: data.date.toDate().toISOString(),
        status: data.status,
      };
    },
  };
}
