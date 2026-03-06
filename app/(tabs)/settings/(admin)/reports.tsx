import { ContentType } from "@/firebaseConfig";
import { forwardRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TestimonyReportList from "@/components/testimonyReportList";
import EventReportList from "@/components/eventReportList";
import CommentReportList from "@/components/commentReportList";
import CustomBackButton from "@/components/customBackButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";

const Reports = () => {
  const { colorScheme } = useColorScheme();
  const [contentType, setContentType] = useState<ContentType>("testimony");

  return (
    <View className="py-safe dark:bg-odbm-gray-digital flex flex-1">
      <View className="py-3 px-2 border-b-2 border-odbm-blue-600 dark:border-odbm-blue-700">
        {/* Header */}
        <View className="h-12 flex flex-row items-center px-4">
          <CustomBackButton />
          <View className="flex-1 flex flex-row pl-2 items-center">
            {/* Title */}
            <Text className="text-3xl tracking-wide font-bold text-odbm-blue-600 dark:text-white">
              Reported Content
            </Text>
            <View className="flex-1 items-end">
              <TouchableOpacity className="flex p-2">
                <Ionicons
                  name="filter"
                  size={26}
                  color={colorScheme == "light" ? "#173A64" : "white"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {contentType === "testimony" && <TestimonyReportList />}
      {contentType === "event" && <EventReportList />}
      {contentType === "comment" && <CommentReportList />}
    </View>
  );
};

export default Reports;
