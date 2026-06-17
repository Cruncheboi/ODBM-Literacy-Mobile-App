import { ContentType } from "@/firebaseConfig";
import { useCallback, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TestimonyReportList from "@/components/testimonyReportList";
import EventReportList from "@/components/eventReportList";
import CommentReportList from "@/components/commentReportList";
import CustomBackButton from "@/components/customBackButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CustomBackground from "@/components/customBackground";
import StyledLabel from "@/components/styledLabel";
import SelectableButton from "@/components/selectableButton";

const Reports = () => {
  const { colorScheme } = useColorScheme();
  const [contentType, setContentType] = useState<ContentType>("testimony");

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const sheetIndexRef = useRef<number>(-1);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
    sheetIndexRef.current = index;
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const onFilterPress = useCallback(() => {
    if (sheetIndexRef.current < 0) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, []);

  const onSelectableButtonPressed = (selectableContentType: ContentType) => {
    setContentType(selectableContentType);
  };

  return (
    <View className="py-safe flex flex-1 bg-primary">
      <View className="border-borderColor-primary border-b-2 px-2 py-3">
        {/* Header */}
        <View className="flex h-12 flex-row items-center px-4">
          <CustomBackButton />
          <View className="flex flex-1 flex-row items-center pl-2">
            {/* Title */}
            <Text className="text-3xl font-bold tracking-wide text-textColor-primary">
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
        index={sheetIndexRef.current}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundComponent={CustomBackground}
      >
        <BottomSheetView className="px-4">
          <StyledLabel label="Filter by Content Type" className="text-2xl" />
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
