import { useCallback, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import CustomBackButton from "@/components/customBackButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CustomBackground from "@/components/customBackground";
import ReportedContentList from "@/components/reports/reportedContentList";
import { Filter, ReportStatus, SortType } from "@/definitions/moderation";
import ContentTypeRadioSelector from "@/components/bottom_sheet/selectors/contentTypeRadioSelector";
import ReportSortByRadioSelector from "@/components/bottom_sheet/selectors/reportSortByRadioSelector";
import StatusRadioSelector from "@/components/bottom_sheet/selectors/statusRadioSelector";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getThemeFontColor } from "@/utility_functions/themeColor";

type ReportFilterOption = "filter_type" | "sort_by" | "status";

const Reports = () => {
  const { colorScheme } = useColorScheme();
  // state
  const [filterOption, setFilterOption] =
    useState<ReportFilterOption>("filter_type");
  const [filterType, setFilterType] = useState<Filter>("all");
  const [reportStatus, setReportStatus] = useState<ReportStatus>("pending");
  const [sortByType, setSortType] = useState<SortType>("count");

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

  const onFilterPress = useCallback((newFilterOption: ReportFilterOption) => {
    if (sheetIndexRef.current < 0 || filterOption !== newFilterOption) {
      setFilterOption(newFilterOption);
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, []);

  return (
    <View className="py-safe flex flex-1 bg-primary">
      <View className="border-b-2 border-borderColor-primary px-2 py-3">
        {/* Header */}
        <View className="flex h-12 flex-row items-center px-4">
          <CustomBackButton />
          <View className="flex flex-1 flex-row items-center pl-2">
            {/* Title */}
            <Text className="text-2xl font-bold tracking-wide text-textColor-primary">
              Reported Content
            </Text>
            <View className="flex-1 items-end p-2">
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  className="flex"
                  onPress={() => onFilterPress("filter_type")}
                >
                  <Ionicons
                    name="filter"
                    size={26}
                    color={getThemeFontColor(colorScheme)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex"
                  onPress={() => onFilterPress("status")}
                >
                  <MaterialIcons
                    name="pending-actions"
                    size={24}
                    color={getThemeFontColor(colorScheme)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex"
                  onPress={() => onFilterPress("sort_by")}
                >
                  <FontAwesome
                    name="sort-amount-desc"
                    size={20}
                    color={getThemeFontColor(colorScheme)}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <ReportedContentList
        filterType={filterType}
        sortBy={sortByType}
        status={reportStatus}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={sheetIndexRef.current}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundComponent={CustomBackground}
      >
        <BottomSheetView className="px-4">
          {filterOption === "filter_type" && (
            <ContentTypeRadioSelector
              value={filterType}
              setValue={setFilterType}
            />
          )}
          {filterOption === "sort_by" && (
            <ReportSortByRadioSelector
              value={sortByType}
              setValue={setSortType}
            />
          )}
          {filterOption === "status" && (
            <StatusRadioSelector
              value={reportStatus}
              setValue={setReportStatus}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Reports;
