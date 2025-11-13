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
import clsx from "clsx";
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
  const firstName = useAppSelector((state) => state.users.firstName);
  const lastName = useAppSelector((state) => state.users.lastName);
  const email = useAppSelector((state) => state.users.email);
  const displayName =
    auth.currentUser != null ? (auth.currentUser.displayName as string) : "";

  const [firstNameInput, setFirstNameInput] = useState(firstName);
  const [lastNameInput, setLastNameInput] = useState(lastName);
  const [displayNameInput, setDisplayNameInput] = useState(displayName);
  const [updateInProgress, setUpdateInProgress] = useState(false);

  const [updatesInProgress, setUpdatesInProgress] = useState<InfoTypes[]>([]);
  const [displayNameUpdating, setDisplayNameUpdating] = useState(false);
  useEffect(() => {}, updatesInProgress);

  return (
    <CustomHeader title="Profile">
      <ScrollView
        className="dark:bg-odbm-gray-digital w-full"
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
        {/* First Name Field */}
        <StyledLabel label="First Name" />
        <StyledTextInput
          onChangeText={setFirstNameInput}
          value={firstNameInput}
        >
          <InputFieldButton
            disabled={firstNameInput?.trim() === firstName || updateInProgress}
            onPress={async () => {
              setUpdateInProgress(true);
              console.log("Started.");
              updateFirstNameDB(dispatch, firstNameInput.trim())
                .catch((error) => {
                  console.log(
                    "An error occured while updating first name in DB. " + error
                  );
                })
                .finally(() => {
                  console.log("Should be finished.");
                  setUpdateInProgress(false);
                });
            }}
          />
        </StyledTextInput>
        {/* Last Name Field */}
        <StyledLabel label="Last Name" />
        <StyledTextInput onChangeText={setLastNameInput} value={lastNameInput}>
          <InputFieldButton
            disabled={lastNameInput?.trim() === lastName || updateInProgress}
            onPress={async () => {
              if (lastNameInput != undefined) {
                setUpdateInProgress(true);
                updateLastNameDB(dispatch, lastNameInput.trim())
                  .catch((error) => {
                    console.log(
                      "An error occured while updating last name in DB. " +
                        error
                    );
                  })
                  .finally(() => {
                    setUpdateInProgress(false);
                  });
              }
            }}
          />
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
      className={clsx("justify-center p-1", className)}
      onPress={onPress}
    >
      {!disabled && (
        <Text className="dark:text-white text-odbm-gray text-2xl">Update</Text>
      )}
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
  return <ActivityIndicator className="dark:color-white color-odbm-gray" />;
};
