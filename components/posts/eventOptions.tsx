import { EventPost } from "@/definitions/posts";
import EditOptionButton from "../bottom_sheet/editOptionButton";
import DeleteOptionButton from "../bottom_sheet/deleteOptionButton";
import ReportOptionButton from "../bottom_sheet/reportOptionButton";
import { router } from "expo-router";
import { CreateReportSearchParams } from "@/app/postActions/createReport";
import { useDeleteEventMutation } from "@/redux/query_services/injectedEndpoints.ts/events";
import { EditEventPostSearchParams } from "@/app/postActions/editEventPost";
import { ContentOptionsProps } from "./testimonyOptions";

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
  const [deleteEventMutation] = useDeleteEventMutation();
  const { postId } = content;
  const strPostId = String(postId);

  const onEdit = () => {
    router.push({
      pathname: "/postActions/editEventPost",
      params: { postId: strPostId } as EditEventPostSearchParams,
    });
  };

  const onDelete = async () => {
    await deleteEventMutation({
      postId,
    });
  };

  const onReport = async () => {
    router.push({
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
      {!showDeleteConfirmation && (
        <ReportOptionButton onReportPress={onReport} />
      )}
    </>
  );
};

export default EventOptions;
