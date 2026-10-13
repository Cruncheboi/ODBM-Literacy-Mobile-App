import EditOptionButton from "../bottom_sheet/editOptionButton";
import DeleteOptionButton from "../bottom_sheet/deleteOptionButton";
import ReportOptionButton from "../bottom_sheet/reportOptionButton";
import { router } from "expo-router";
import { CreateReportSearchParams } from "@/app/postActions/createReport";
import { ContentOptionsProps } from "../posts/testimonyOptions";
import { CommentPost } from "@/definitions/comments";
import { useDeleteCommentMutation } from "@/redux/query_services/injectedEndpoints.ts/comments";
import { EditCommentSearchParams } from "@/app/postActions/editComment";

interface CommentOptionsProps extends ContentOptionsProps {
  content: CommentPost;
}

const CommentOptions = ({
  content,
  isOwner,
  isAdmin,
  setShowDeleteConfirmation,
  showDeleteConfirmation,
}: CommentOptionsProps) => {
  const [deleteCommentMutation] = useDeleteCommentMutation();
  const { commentId, body, postId } = content;
  const strCommentId = String(commentId);

  const onEdit = () => {
    router.push({
      pathname: "/postActions/editComment",
      params: {
        commentId: strCommentId,
        oldBody: body,
        postId: String(postId),
      } as EditCommentSearchParams,
    });
  };

  const onDelete = async () => {
    await deleteCommentMutation({
      commentId,
      postId,
    });
  };

  const onReport = async () => {
    router.push({
      pathname: "/postActions/createReport",
      params: { commentId: strCommentId } as CreateReportSearchParams,
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

export default CommentOptions;
