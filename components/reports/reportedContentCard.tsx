import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";
import { ViewPostSearchParams } from "@/app/postActions/viewPost";
import { ViewReportSearchParams } from "@/app/postActions/viewReport";
import { GroupedModerationItem } from "@/definitions/moderation";
import StyledLabel from "../styledLabel";

interface Props {
  reportedContent: GroupedModerationItem;
}

const ReportedContentCard = ({ reportedContent }: Props) => {
  const {
    postId,
    commentId,
    reportCount,
    reportType,
    topReason,
    latestTimestamp,
  } = reportedContent;
  const strPostId = String(postId);
  const strCommentId = String(commentId);
  const date = new Date(latestTimestamp);

  const onPressPost = () => {
    router.push({
      pathname: "/postActions/viewReport",
      params: {
        postId: strPostId,
        commentId: strCommentId,
        contentType: reportType,
      } as ViewReportSearchParams,
    });
  };

  return (
    <View className="max-h-[340px] w-11/12 self-center rounded-xl p-3">
      <TouchableOpacity className="w-full" onPress={onPressPost}>
        <View className="flex flex-row justify-items-center">
          <Text className="text-highlight">Content Id:</Text>
          <View className="flex-1">
            <Text className="text-highlight">
              {postId ? strPostId : strCommentId}
            </Text>
          </View>
          <Text className="text-textColor-body">
            {date.toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        {/* <Text className="mt-2 line-clamp-3 text-xl font-bold text-textColor-title">
          {topReason}
        </Text>
        <View className="max-h-40 pb-4">
          <Text className="line-clamp-5 text-lg text-textColor-body">
            {reportCount}
          </Text>
        </View> */}
        <View className="flex flex-row justify-items-center">
          <StyledLabel label="Most Common Flag: " />
          <StyledLabel label={topReason} />
        </View>
        <View className="flex flex-row justify-items-center">
          <StyledLabel label="Total Reports: " />
          <StyledLabel label={reportCount} />
        </View>
        <View className="flex flex-row justify-items-center">
          <StyledLabel label="Last Reported: " />
          <StyledLabel
            label={date.toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default ReportedContentCard;
