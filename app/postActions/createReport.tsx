import CustomBackground from "@/components/customBackground";
import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledButton from "@/components/styledButton";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { createReport } from "@/firebase_functions/reportFunctions";
import { ContentType, ReportReason } from "@/firebaseConfig";
import cn from "@/utility_functions/cn";
import { getAccentColor } from "@/utility_functions/themeColor";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useRef, useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";

export type CreateReportSearchParams = {
  contentType: ContentType;
  documentId: string;
};

type CreationStatus = "submitting" | "typing";

const CreateReport = () => {
  const { colorScheme } = useColorScheme();
  // Report state
  const [status, setStatus] = useState<CreationStatus>("typing");
  const { contentType, documentId } =
    useLocalSearchParams<CreateReportSearchParams>();

  // Input state
  const [reason, setReason] = useState<ReportReason>("spam");
  const [explanation, setExplanation] = useState("");
  const explanationCharLimit = 300;
  const reasons: ReportReason[] = ["spam", "harassment", "hate speech"];

  // Renders
  const reasonSelectorButtons = useCallback(
    () =>
      reasons.map((currentReason) => (
        <StyledButton
          className={cn(currentReason === reason && "dark:bg-odbm-gray")}
          key={currentReason}
          label={<StyledLabel label={currentReason} className="capitalize" />}
          onPress={() => {
            setReason(currentReason);
            bottomSheetRef.current?.close();
          }}
        />
      )),
    [reasons, reason],
  );

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

  // Bottom Sheet refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const sheetIndexRef = useRef<number>(-1);

  // Callbacks
  const handleSheetChanges = useCallback((index: number) => {
    sheetIndexRef.current = index;
  }, []);

  const onEditReasonPress = useCallback(() => {
    if (sheetIndexRef.current < 0) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, []);

  const onPostSubmit = async () => {
    if (status === "submitting") return;
    setStatus("submitting");
    const wasSuccessful = await createReport(
      documentId,
      contentType,
      reason,
      explanation,
    );
    if (wasSuccessful) {
      router.back();
    } else {
      setStatus("typing");
    }
  };

  return (
    <CustomHeader title="Create Report">
      <ScrollView
        className="w-full px-3 pb-3 flex"
        contentContainerClassName="gap-3"
      >
        {/** Reason */}
        <View className="h-16 flex flex-row w-full items-center justify-start mt-6">
          <StyledLabel label="Reason" className="text-2xl" />
          <TouchableOpacity
            className="ml-5 bg-odbm-gray rounded-md px-3 py-2 flex flex-row justify-start items-center "
            onPress={onEditReasonPress}
          >
            <FontAwesome5
              name="edit"
              size={20}
              color={getAccentColor(colorScheme)}
            />
            <Text className="pl-2 dark:text-white capitalize text-xl">
              {reason}
            </Text>
          </TouchableOpacity>
        </View>
        {/** Explanation */}
        <View className="h-60">
          <View className="flex-row gap-2 items-center">
            <StyledLabel label="Explanation" className="text-2xl" />
            <StyledLabel label="(Optional)" className="dark:color-odbm-gray" />
          </View>
          <StyledTextInput
            placeholder="Enter your explanation here..."
            onChangeText={setExplanation}
            value={explanation}
            maxLen={explanationCharLimit}
            multiline={true}
            editable={status !== "submitting"}
            autoCapitalize="sentences"
          />
        </View>
        {explanation.length == explanationCharLimit && (
          <ErrorText>
            Max length of {explanationCharLimit.toString()} characters reached.
          </ErrorText>
        )}
        <View>
          <CustomOpacityButton
            title="Create Report"
            onPress={onPostSubmit}
            disabled={status === "submitting"}
          />
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={sheetIndexRef.current}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundComponent={CustomBackground}
      >
        <BottomSheetView className="p-4 justify-center items-center gap-3">
          {reasonSelectorButtons()}
        </BottomSheetView>
      </BottomSheet>
    </CustomHeader>
  );
};
export default CreateReport;
