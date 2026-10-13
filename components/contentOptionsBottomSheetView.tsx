import { BottomSheetView } from "@gorhom/bottom-sheet";
import { auth } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { checkIfIsAdmin } from "@/firebase_functions/firebaseFunctions";
import { EventPost, TestimonyPost } from "@/definitions/posts";
import { CommentPost } from "@/definitions/comments";
import { Content, ContentType } from "@/definitions/api";
import TestimonyOptions from "./posts/testimonyOptions";
import EventOptions from "./posts/eventOptions";
import CommentOptions from "./comments/commentOptions";

interface ContentOptionsProps {
  content?: Content | null;
  contentType: ContentType;
}

const ContentOptionsBottomSheetView = ({
  content,
  contentType,
}: ContentOptionsProps) => {
  // Content does not exist or has not loaded yet
  if (!content) {
    return;
  }

  const { authorFirebaseUid } = content;

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const isOwner = authorFirebaseUid === auth.currentUser?.uid;

  const getIsAdmin = async () => {
    const isAdmin = await checkIfIsAdmin();
    setIsAdmin(isAdmin);
  };

  useEffect(() => {
    getIsAdmin();
  }, []);

  return (
    <BottomSheetView className="items-center justify-center gap-4 p-4">
      {/** Testimony Options */}
      {contentType === "testimony" && (
        <TestimonyOptions
          content={content as TestimonyPost}
          isAdmin={isAdmin}
          isOwner={isOwner}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          showDeleteConfirmation={showDeleteConfirmation}
        />
      )}
      {/** Event Options */}
      {contentType === "event" && (
        <EventOptions
          content={content as EventPost}
          isAdmin={isAdmin}
          isOwner={isOwner}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          showDeleteConfirmation={showDeleteConfirmation}
        />
      )}
      {/** Comment Options */}
      {contentType === "comment" && (
        <CommentOptions
          content={content as CommentPost}
          isAdmin={isAdmin}
          isOwner={isOwner}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          showDeleteConfirmation={showDeleteConfirmation}
        />
      )}
    </BottomSheetView>
  );
};
export default ContentOptionsBottomSheetView;
