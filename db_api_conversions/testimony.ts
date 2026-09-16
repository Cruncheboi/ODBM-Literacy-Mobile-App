import { ContentType } from "@/definitions/api";
import { TestimonyPost } from "@/definitions/posts";

export class TestimonyConverter {
  static converter = {
    fromApi: (snapshot: DocumentSnapshot): TestimonyPost => {
      return {
        postType: "testimony" satisfies ContentType,
        postId: snapshot.id,
        displayName: data.displayName,
        user: data.user,
        date: data.date.toDate().toISOString(),
        title: data.title,
        body: data.body,
        reports: data.reports,
      };
    },
  };
}
