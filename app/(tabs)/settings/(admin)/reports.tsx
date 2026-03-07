import { ContentType } from "@/firebaseConfig";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TestimonyReportList from "@/components/testimonyReportList";
import EventReportList from "@/components/eventReportList";
import CommentReportList from "@/components/commentReportList";
import CustomBackButton from "@/components/customBackButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import CustomBackground from "@/components/customBackground";
import StyledLabel from "@/components/styledLabel";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SelectableButton from "@/components/selectableButton";

const Reports = () => {
  const { colorScheme } = useColorScheme();
  const snapPoints = useMemo(() => ["50%"], []);
  const [contentType, setContentType] = useState<ContentType>("testimony");

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const sheetIndex = useRef<number>(-1);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
    sheetIndex.current = index;
  }, []);

  const onFilterPress = useCallback(() => {
    if (sheetIndex.current < 0) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, []);

  const onSelectableButtonPressed = (selectableContentType: ContentType) => {
    setContentType(selectableContentType);
  };

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
              <TouchableOpacity className="flex p-2" onPress={onFilterPress}>
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
      <BottomSheet
        ref={bottomSheetRef}
        index={sheetIndex.current}
        onChange={handleSheetChanges}
        enablePanDownToClose
        snapPoints={snapPoints}
        backgroundComponent={CustomBackground}
      >
        <BottomSheetView className="px-4">
          {/* <Textclas>Awesome 🎉</Text>
           */}

          <StyledLabel label="Filter by Content Type" textSize="text-2xl" />
          <SelectableButton
            isSelected={contentType === "testimony"}
            handleSelectAction={() => onSelectableButtonPressed("testimony")}
          >
            <StyledLabel label="Testimony" />
          </SelectableButton>
          <SelectableButton
            isSelected={contentType === "event"}
            handleSelectAction={() => onSelectableButtonPressed("event")}
          >
            <StyledLabel label="Event" />
          </SelectableButton>
          <SelectableButton
            isSelected={contentType === "comment"}
            handleSelectAction={() => onSelectableButtonPressed("comment")}
          >
            <StyledLabel label="Comment" />
          </SelectableButton>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Reports;
