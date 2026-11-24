import { EventPost } from "@/definitions/posts";
import EditOptionButton from "../bottom_sheet/buttons/editOptionButton";
import DeleteOptionButton from "../bottom_sheet/buttons/deleteOptionButton";
import ReportOptionButton from "../bottom_sheet/buttons/reportOptionButton";
import { router } from "expo-router";
import { CreateReportSearchParams } from "@/app/postActions/createReport";
import { ContentOptionsProps } from "./testimonyOptions";
import { useDeletePostMutation } from "@/redux/query_services/injectedEndpoints.ts/posts";
import { EditPostSearchParams } from "@/app/postActions/editPost";

interface EventOptionsProps extends ContentOptionsProps {
  content: EventPost;
}

const EventOptions = ({
  content,
  isOwner,
  isAdmin,
  setShowDeleteConfirmation,
  showDeleteConfirmation,
}: EventOptionsProps) => {
  const [deleteEventMutation] = useDeletePostMutation();
  const { postId } = content;
  const strPostId = String(postId);

  const onEdit = () => {
    router.navigate({
      pathname: "/postActions/editPost",
      params: { postId: strPostId, postType: "event" } as EditPostSearchParams,
    });
  };

  const onDelete = async () => {
    try {
      await deleteEventMutation({
        postId,
        postType: "event",
      }).unwrap();
      router.dismissTo("/(tabs)/posts/events");
    } catch (error) {
      console.warn(error);
    }
  };

  const onReport = async () => {
    router.navigate({
      pathname: "/postActions/createReport",
      params: { postId: strPostId } as CreateReportSearchParams,
    });
  };

  return (
    <>
      {isOwner && !showDeleteConfirmation && (
        <EditOptionButton onEditPress={onEdit} />
      )}
      {(isOwner || isAdmin) && (
        <DeleteOptionButton
          onDelete={onDelete}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          showDeleteConfirmation={showDeleteConfirmation}
        />
      )}
      {!showDeleteConfirmation && !isOwner && (
        <ReportOptionButton onReportPress={onReport} />
      )}
    </>
  );
};

export default EventOptions;
