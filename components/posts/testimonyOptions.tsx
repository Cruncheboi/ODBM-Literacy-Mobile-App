import { TestimonyPost } from "@/definitions/posts";
import EditOptionButton from "../bottom_sheet/buttons/editOptionButton";
import DeleteOptionButton, {
  DeleteOptionsProps,
} from "../bottom_sheet/buttons/deleteOptionButton";
import ReportOptionButton from "../bottom_sheet/buttons/reportOptionButton";
import { router } from "expo-router";
import { EditTestimonyPostSearchParams } from "@/app/postActions/editTestimonyPost";
import { useDeleteTestimonyMutation } from "@/redux/query_services/injectedEndpoints.ts/testimonies";
import { CreateReportSearchParams } from "@/app/postActions/createReport";
import { StrictOmit } from "@/definitions/api";

export interface ContentOptionsProps extends StrictOmit<
  DeleteOptionsProps,
  "onDelete"
> {
  isOwner: boolean;
  isAdmin: boolean;
}

interface TestimonyOptionsProps extends ContentOptionsProps {
  content: TestimonyPost;
}

const TestimonyOptions = ({
  content,
  isOwner,
  isAdmin,
  setShowDeleteConfirmation,
  showDeleteConfirmation,
}: TestimonyOptionsProps) => {
  const [deleteTestimonyMutation] = useDeleteTestimonyMutation();
  const { postId } = content;
  const strPostId = String(postId);

  const onEdit = () => {
    router.push({
      pathname: "/postActions/editTestimonyPost",
      params: { postId: strPostId } as EditTestimonyPostSearchParams,
    });
  };

  const onDelete = async () => {
    await deleteTestimonyMutation({
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
      {!showDeleteConfirmation && !isOwner && (
        <ReportOptionButton onReportPress={onReport} />
      )}
    </>
  );
};

export default TestimonyOptions;
