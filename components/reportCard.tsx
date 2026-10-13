import { ReportHistoryItem } from "@/definitions/moderation";
import { View, Text } from "react-native";

interface Props {
  report: ReportHistoryItem;
}

const ReportCard = ({ report }: Props) => {
  const { timestamp, reporterName, reason, details } = report;
  const date = new Date(timestamp);

  return (
    <View className="flex w-full rounded-2xl border border-borderColor-primary bg-bgColor-primary p-2">
      <View className="flex flex-row">
        <Text className="flex-1 text-highlight">@{reporterName}</Text>
        <Text className="text-textColor-body">
          {date.toLocaleDateString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <Text className="text-textColor-body">{`Reason: ${reason}`}</Text>
      <Text className="text-textColor-body">{`Details: ${details}`}</Text>
    </View>
  );
};
export default ReportCard;
