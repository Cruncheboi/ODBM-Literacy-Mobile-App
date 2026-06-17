import { Report } from "@/firebaseConfig";
import { View, Text } from "react-native";

interface Props {
  report: Report;
}

const ReportCard = ({ report }: Props) => {
  const date = new Date(report.date);

  return (
    <View className="border-borderColor-primary flex w-full rounded-2xl border bg-bgColor-primary p-2">
      <View className="flex flex-row">
        <Text className="flex-1 text-highlight">@{report.displayName}</Text>
        <Text className="text-textColor-body">
          {date.toLocaleDateString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <Text className="text-textColor-body">{`Reason: ${report.reason}`}</Text>
      <Text className="text-textColor-body">{`Explanation: ${report.explanation}`}</Text>
    </View>
  );
};
export default ReportCard;
