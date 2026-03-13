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

interface ContentOptionsProps {
  content?: Content | null;
}

const ContentOptionsBottomSheetView = ({ content }: ContentOptionsProps) => {
  const { colorScheme } = useColorScheme();

  const isOwner = content ? content.user === auth.currentUser?.uid : false;
  console.log("Options: ", content?.user, "===", auth.currentUser?.uid);
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
            onPress={() => {}}
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
          if (content) {
            router.push({
              pathname: "/postActions/createReport",
              params: {
                contentType: content.contentType,
                documentId: content.documentId,
              } as CreateReportSearchParams,
            });
          }
        }}
      />
    </BottomSheetView>
  );
};
export default ContentOptionsBottomSheetView;
