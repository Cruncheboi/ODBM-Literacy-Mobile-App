import { Report } from "@/firebaseConfig";
import { View, Text } from "react-native";

interface Props {
  report: Report;
}

const ReportCard = ({ report }: Props) => {
  const date = new Date(report.date);

  return (
    <View className="flex w-full border p-2 rounded-2xl border-gray-400 bg-odbm-gray-digital-dark">
      <View className="flex flex-row">
        <Text className="text-odbm-gold flex-1">@{report.displayName}</Text>
        <Text className="dark:text-gray-300 text-odbm-blue-600">
          {date.toLocaleDateString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <Text className="dark:text-gray-300">{`Reason: ${report.reason}`}</Text>
      <Text className="dark:text-gray-300">{`Explanation: ${report.explanation}`}</Text>
    </View>
  );
};
export default ReportCard;
