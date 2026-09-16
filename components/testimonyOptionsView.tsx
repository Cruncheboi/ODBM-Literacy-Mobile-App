import { BottomSheetView } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import StyledButton from "./styledButton";
import { getThemeFontColor } from "@/utility_functions/themeColor";
import StyledLabel from "./styledLabel";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "nativewind";
import { auth } from "@/firebaseConfig";
import { router } from "expo-router";
import { CreateReportSearchParams } from "@/app/postActions/createReport";
import { useCallback, useEffect, useState } from "react";
import { checkIfIsAdmin } from "@/firebase_functions/firebaseFunctions";
import { TestimonyPost } from "@/definitions/posts";
import EditOptionButton from "./bottom_sheet/editOptionButton";
import { EditTestimonyPostSearchParams } from "@/app/postActions/editTestimonyPost";
import DeleteOptionButton from "./bottom_sheet/deleteOptionButton";
import ReportOptionButton from "./bottom_sheet/reportOptionButton";

interface TestimonyOptionsProps {
  testimony?: TestimonyPost | null;
}

const TestimonyOptionsView = ({ testimony }: TestimonyOptionsProps) => {
  const { colorScheme } = useColorScheme();
  // Content does not exist or has not loaded yet
  if (!testimony) {
    return;
  }

  const { postId, authorFirebaseUid } = testimony;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const isOwner = authorFirebaseUid === auth.currentUser?.uid;

  const getIsAdmin = useCallback(async () => {
    const isAdmin = await checkIfIsAdmin();
    setIsAdmin(isAdmin);
  }, [testimony]);

  useEffect(() => {
    getIsAdmin();
  }, []);

  const onDeleteTestimony = async () => {
    try {
    } catch (error) {
      console.error("Post deletion unsuccessful.", error);
    }
  };

  const onEditPressed = () => {
    router.push({
      pathname: "/postActions/editTestimonyPost",
      params: {
        postId,
      } as EditTestimonyPostSearchParams,
    });
  };

  if (showDeleteConfirmation) {
    return (
      <BottomSheetView className="items-center justify-center gap-3 p-4">
        <DeleteOptionButton
          onDelete={onDeleteTestimony}
          setShowDeleteConfirmation={(isShown: boolean) =>
            setShowDeleteConfirmation(isShown)
          }
          showDeleteConfirmation={showDeleteConfirmation}
        />
      </BottomSheetView>
    );
  }

  return (
    <BottomSheetView className="items-center justify-center gap-2 p-4">
      {isOwner && <EditOptionButton onPress={onEditPressed} />}
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
        </>
      )}
      <ReportOptionButton
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
export default TestimonyOptionsView;
