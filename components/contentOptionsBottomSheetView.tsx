import { BottomSheetView } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import StyledButton from "./styledButton";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getThemeFontColor } from "@/utility_functions/themeColor";
import StyledLabel from "./styledLabel";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "nativewind";
import { auth, Content } from "@/firebaseConfig";
import { router } from "expo-router";
import { CreateReportSearchParams } from "@/app/postActions/createReport";
import { EditPostSearchParams } from "@/app/postActions/editPost";
import { EditCommentSearchParams } from "@/app/postActions/editComment";
import { useDeleteCommentMutation } from "@/redux/services/injectedEndpoints.ts/comments";
import { useEffect, useState } from "react";
import { checkIfIsAdmin } from "@/firebase_functions/firebaseFunctions";

interface ContentOptionsProps {
  content?: Content | null;
}

const ContentOptionsBottomSheetView = ({ content }: ContentOptionsProps) => {
  const { colorScheme } = useColorScheme();
  // Content does not exist or has not loaded yet
  if (!content) {
    return;
  }
  const { documentId, user, contentType, body, reports } = content;
  const [deleteCommentMutation, result] = useDeleteCommentMutation();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const isOwner = user === auth.currentUser?.uid;

  const getIsAdmin = async () => {
    const isAdmin = await checkIfIsAdmin();
    setIsAdmin(isAdmin);
  };

  useEffect(() => {
    getIsAdmin();
  }, []);

  const onDeleteContent = async () => {
    try {
      if (contentType === "comment") {
        const wasSuccessful = await deleteCommentMutation({
          documentId,
          postId: content.postID,
          reports,
          postType: content.postType,
        });
      }
    } catch (error) {
      console.error("Post deletion unsuccessful.", error);
    }
  };

  if (showDeleteConfirmation) {
    return (
      <BottomSheetView className="p-4 justify-center items-center gap-3">
        <StyledButton
          className="bg-red-700 dark:bg-red-700"
          label={<StyledLabel label="Delete" />}
          onPress={async () => {
            onDeleteContent();
            setShowDeleteConfirmation(false);
          }}
        />
        <StyledButton
          label={<StyledLabel label="Go Back" />}
          onPress={() => setShowDeleteConfirmation(false)}
        />
      </BottomSheetView>
    );
  }

  return (
    <BottomSheetView className="p-4 justify-center items-center">
      {isOwner && (
        <>
          <StyledButton
            icon={
              <View className="pr-4">
                <FontAwesome5
                  name="edit"
                  size={24}
                  color={getThemeFontColor(colorScheme)}
                />
              </View>
            }
            label={<StyledLabel label="Edit Post" />}
            onPress={() => {
              if (contentType === "testimony" || contentType === "event") {
                router.push({
                  pathname: "/postActions/editPost",
                  params: {
                    documentId,
                    oldBody: body,
                    oldTitle: content.title,
                    type: contentType,
                  } as EditPostSearchParams,
                });
              } else {
                router.push({
                  pathname: "/postActions/editComment",
                  params: {
                    documentId,
                    postID: content.postID,
                    oldBody: body,
                    numOfreports: reports.toString(),
                    postType: content.postType,
                  } as EditCommentSearchParams,
                });
              }
            }}
          />
          <View className="py-2" />
        </>
      )}
      {(isOwner || isAdmin) && (
        <>
          <StyledButton
            icon={
              <View className="pr-4">
                <MaterialIcons
                  name="delete"
                  size={24}
                  color={getThemeFontColor(colorScheme)}
                />
              </View>
            }
            label={<StyledLabel label="Delete Post" />}
            onPress={() => setShowDeleteConfirmation(true)}
          />
          <View className="py-2" />
        </>
      )}
      <StyledButton
        icon={
          <View className="pr-4">
            <MaterialIcons
              name="report"
              size={28}
              color={getThemeFontColor(colorScheme)}
            />
          </View>
        }
        label={<StyledLabel label="Report Post" />}
        onPress={() => {
          router.push({
            pathname: "/postActions/createReport",
            params: {
              contentType: contentType,
              documentId: documentId,
            } as CreateReportSearchParams,
          });
        }}
      />
    </BottomSheetView>
  );
};
export default ContentOptionsBottomSheetView;
