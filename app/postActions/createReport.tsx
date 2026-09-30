import CustomBackground from "@/components/customBackground";
import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import ErrorText from "@/components/errorText";
import StyledButton from "@/components/styledButton";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import {
  DETAILS_CHAR_LIMIT,
  REPORT_REASON_OPTIONS,
  ReportReason,
} from "@/definitions/moderation";
import { createReport } from "@/firebase_functions/reportFunctions";
import { ContentType } from "@/firebaseConfig";
import { useCreateReportMutation } from "@/redux/query_services/injectedEndpoints.ts/moderation";
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
  postId?: string;
  commentId?: string;
};

type CreationStatus = "submitting" | "typing";

const CreateReport = () => {
  const { colorScheme } = useColorScheme();
  // Report state
  const [status, setStatus] = useState<CreationStatus>("typing");
  const { postId, commentId } =
    useLocalSearchParams<CreateReportSearchParams>();
  const [createReport] = useCreateReportMutation();

  // Input state
  const [reason, setReason] = useState<ReportReason>(ReportReason.Spam);
  const [details, setDetails] = useState("");

  // Renders
  const reasonSelectorButtons = useCallback(
    () =>
      REPORT_REASON_OPTIONS.map(({ label, value }) => (
        <StyledButton
          className={cn(value === reason && "bg-highlight")}
          key={value}
          label={
            <StyledLabel label={label} className="font-semibold capitalize" />
          }
          onPress={() => {
            setReason(value);
            bottomSheetRef.current?.close();
          }}
        />
      )),
    [reason],
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
    try {
      await createReport({ reason });
    } catch (error) {
      router.back();
    } finally {
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
            onChangeText={setDetails}
            value={details}
            maxLen={DETAILS_CHAR_LIMIT}
            multiline={true}
            editable={status !== "submitting"}
            autoCapitalize="sentences"
          />
        </View>
        {details.length == DETAILS_CHAR_LIMIT && (
          <ErrorText>
            Max length of {DETAILS_CHAR_LIMIT.toString()} characters reached.
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
