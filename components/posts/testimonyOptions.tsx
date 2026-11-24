import { TestimonyPost } from "@/definitions/posts";
import EditOptionButton from "../bottom_sheet/buttons/editOptionButton";
import DeleteOptionButton, {
  DeleteOptionsProps,
} from "../bottom_sheet/buttons/deleteOptionButton";
import ReportOptionButton from "../bottom_sheet/buttons/reportOptionButton";
import { router } from "expo-router";
import { CreateReportSearchParams } from "@/app/postActions/createReport";
import { StrictOmit } from "@/definitions/api";
import { useDeletePostMutation } from "@/redux/query_services/injectedEndpoints.ts/posts";
import { EditPostSearchParams } from "@/app/postActions/editPost";

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
  const [deleteTestimonyMutation] = useDeletePostMutation();
  const { postId } = content;
  const strPostId = String(postId);

  const onEdit = () => {
    router.navigate({
      pathname: "/postActions/editPost",
      params: {
        postId: strPostId,
        postType: "testimony",
      } as EditPostSearchParams,
    });
  };

  const onDelete = async () => {
    try {
      await deleteTestimonyMutation({
        postId,
        postType: "testimony",
      }).unwrap();
      router.dismissTo("/(tabs)/posts");
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

export default TestimonyOptions;
