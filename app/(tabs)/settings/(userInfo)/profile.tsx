import CustomHeader from "@/components/customHeader";
import SecureTextInput from "@/components/secureTextInput";
import StyledLabel from "@/components/styledLabel";
import StyledTextInput from "@/components/styledTextInput";
import { auth } from "@/firebaseConfig";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  updateDisplayName,
  updateFirstNameDB,
  updateLastNameDB,
} from "@/redux/storageSync";
import cn from "@/utility_functions/cn";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

type InfoTypes = "display name" | "";

const Profile = () => {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.users.email);
  const displayName =
    auth.currentUser != null ? (auth.currentUser.displayName as string) : "";

  const [displayNameInput, setDisplayNameInput] = useState(displayName);

  const [updatesInProgress, setUpdatesInProgress] = useState<InfoTypes[]>([]);
  const [displayNameUpdating, setDisplayNameUpdating] = useState(false);

  return (
    <CustomHeader title="Profile">
      <ScrollView
        className="w-full bg-primary"
        contentContainerClassName="py-8 px-5"
        keyboardShouldPersistTaps="handled"
      >
        {/* Display Name Field */}
        <StyledLabel label="Display Name" />
        <StyledTextInput
          onChangeText={setDisplayNameInput}
          value={displayNameInput}
        >
          <InputFieldButton
            disabled={
              displayNameInput === displayName ||
              displayNameUpdating ||
              hasEmptyString(displayNameInput)
            }
            onPress={async () => {
              setDisplayNameUpdating(true);
              await updateDisplayName(displayNameInput.trim());
              setDisplayNameUpdating(false);
            }}
          />
          <LoadingIndicator isLoading={displayNameUpdating} />
        </StyledTextInput>
        {/* User ID Field */}
        <StyledLabel label="User ID" />
        <SecureTextInput
          editable={false}
          onChangeText={() => {}}
          value={
            auth.currentUser != null
              ? auth.currentUser.uid
              : "Log back in to view"
          }
        ></SecureTextInput>
      </ScrollView>
    </CustomHeader>
  );
};

export default Profile;

const InputFieldButton = ({
  disabled,
  className,
  onPress,
}: TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      className={cn("justify-center p-1", className)}
      onPress={onPress}
    >
      {!disabled && <Text className="text-2xl text-highlight">Update</Text>}
    </TouchableOpacity>
  );
};

const hasEmptyString = (str: string): boolean => {
  return str.trim() == "";
};

interface LoadingIndicatorProps {
  isLoading: boolean;
}
const LoadingIndicator = ({ isLoading }: LoadingIndicatorProps) => {
  if (!isLoading) return false;
  return <ActivityIndicator className="color-odbm-gray dark:color-white" />;
};
