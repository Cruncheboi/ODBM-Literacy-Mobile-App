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

interface ContentOptionsProps {
  content?: Content | null;
}

const ContentOptionsBottomSheetView = ({ content }: ContentOptionsProps) => {
  const { colorScheme } = useColorScheme();
  // Content does not exist or has not loaded yet
  if (!content) {
    return;
  }
  const { documentId, user, contentType, body } = content;

  const isOwner = user === auth.currentUser?.uid;
  console.log("Options: ", user, "===", auth.currentUser?.uid);
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
                  } as EditCommentSearchParams,
                });
              }
            }}
          />
          <View className="py-2" />
        </>
      )}
      {isOwner && (
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
            onPress={() => {}}
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
