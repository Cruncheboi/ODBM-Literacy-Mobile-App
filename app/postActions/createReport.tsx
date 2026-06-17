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
import {
  getAccentColor,
  getThemeHighlightColor,
} from "@/utility_functions/themeColor";
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
          className={cn(currentReason === reason && "bg-highlight")}
          key={currentReason}
          label={
            <StyledLabel
              label={currentReason}
              className="font-semibold capitalize"
            />
          }
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
        className="flex w-full px-3 pb-3"
        contentContainerClassName="gap-3"
      >
        {/** Reason */}
        <View className="mt-6 flex h-16 w-full flex-row items-center justify-start">
          <StyledLabel label="Reason" className="text-2xl font-bold" />
          <TouchableOpacity
            className="ml-5 flex flex-row items-center justify-start rounded-md bg-bgColor-primary px-3 py-2"
            onPress={onEditReasonPress}
          >
            <FontAwesome5
              name="edit"
              size={20}
              color={getThemeHighlightColor(colorScheme)}
            />
            <Text className="pl-2 text-xl font-semibold capitalize text-textColor-primary">
              {reason}
            </Text>
          </TouchableOpacity>
        </View>
        {/** Explanation */}
        <View className="h-60">
          <View className="flex-row items-center gap-2">
            <StyledLabel label="Explanation" className="text-2xl font-bold" />
            <StyledLabel label="(Optional)" />
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
        <BottomSheetView className="items-center justify-center gap-3 p-4">
          {reasonSelectorButtons()}
        </BottomSheetView>
      </BottomSheet>
    </CustomHeader>
  );
};
export default CreateReport;
