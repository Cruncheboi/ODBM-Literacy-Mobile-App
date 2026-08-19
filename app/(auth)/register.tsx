import { useCallback, useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { updateIsSignedIn } from "@/redux/features/usersSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  createUserWithEmailAndPassword,
  PasswordValidationStatus,
  validatePassword,
} from "firebase/auth";
import { auth, UserInfo } from "@/firebaseConfig";
import CustomOpacityButton from "@/components/customOpacityButton";
import SecureTextInput from "@/components/secureTextInput";
import StyledTextInput from "@/components/styledTextInput";
import StyledLabel from "@/components/styledLabel";
import ErrorText from "@/components/errorText";
import { createUserAccountInfo } from "@/redux/storageSync";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { checkIfDisplayNameIsAvailable } from "@/firebase_functions/firebaseFunctions";
import { debounce } from "lodash";
import InfoText from "@/components/infoText";
import Toast from "react-native-toast-message";
import cn from "@/utility_functions/cn";

// Constants
const PASSWORD_MIN_LEN = 8;
const PASSWORD_MAX_LEN = 4096;

/**
 * A structure indicating which password policy requirements were met or violated and what the
 * requirements are.
 *
 * @public
 */
interface PasswordValidationStatusMutable {
  /**
   * Whether the password meets all requirements.
   */
  isValid: boolean;
  /**
   * Whether the password meets the minimum password length, or undefined if not required.
   */
  meetsMinPasswordLength?: boolean;
  /**
   * Whether the password meets the maximum password length, or undefined if not required.
   */
  meetsMaxPasswordLength?: boolean;
  /**
   * Whether the password contains a lowercase letter, or undefined if not required.
   */
  containsLowercaseLetter?: boolean;
  /**
   * Whether the password contains an uppercase letter, or undefined if not required.
   */
  containsUppercaseLetter?: boolean;
  /**
   * Whether the password contains a numeric character, or undefined if not required.
   */
  containsNumericCharacter?: boolean;
  /**
   * Whether the password contains a non-alphanumeric character, or undefined if not required.
   */
  containsNonAlphanumericCharacter?: boolean;
}

const Register = () => {
  // Form values
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Other state
  const [loadingDisplayNameCheck, setLoadingDisplayNameCheck] = useState(false);

  // Validation
  const [displayNameAvailable, setDisplayNameAvailable] = useState<
    boolean | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordStatus, setPasswordStatus] =
    useState<PasswordValidationStatusMutable>({
      isValid: false,
      containsLowercaseLetter: false,
      containsUppercaseLetter: false,
      containsNonAlphanumericCharacter: false,
      containsNumericCharacter: false,
      meetsMinPasswordLength: false,
      meetsMaxPasswordLength: false,
    });

  // Storage
  const dispatch = useAppDispatch();

  // Password validation status
  useEffect(() => {
    console.log(password);
    // Password contains a lowercase character
    const containsLowercaseRegex = /[a-z]/;
    const containsLowercase = containsLowercaseRegex.test(password);

    // Password contains an uppercase character
    const containsUppercaseRegex = /[A-Z]/;
    const containsUppercase = containsUppercaseRegex.test(password);

    // Password contains a nonalphanumeric character
    const containsNonAlphanumericRegex =
      /[$*.\[\]{}\(\)?"!@#%&\/\\,><':;\|_~`-]/;
    const containsNonAlphanumeric = containsNonAlphanumericRegex.test(password);

    // Password contains a number
    const containsNumericRegex = /[\d]/;
    const containsNumeric = containsNumericRegex.test(password);

    // Password meets length requirements
    const meetsMinPasswordLength = password.length >= PASSWORD_MIN_LEN;
    const meetsMaxPasswordLength = password.length <= PASSWORD_MAX_LEN;

    // Update password status
    setPasswordStatus({
      containsLowercaseLetter: containsLowercase,
      containsUppercaseLetter: containsUppercase,
      containsNonAlphanumericCharacter: containsNonAlphanumeric,
      containsNumericCharacter: containsNumeric,
      meetsMinPasswordLength: meetsMinPasswordLength,
      meetsMaxPasswordLength: meetsMaxPasswordLength,
      isValid:
        containsLowercase &&
        containsUppercase &&
        containsNonAlphanumeric &&
        containsNumeric &&
        meetsMinPasswordLength &&
        meetsMaxPasswordLength,
    });
    return () => {};
  }, [password]);

  // Create new user account
  const handleRegister = async () => {
    if (!passwordStatus.isValid) return;
    const emailLowerCased = email.toLowerCase();
    const status = await validatePassword(auth, password);
    // Only create account with a valid password
    if (status.isValid) {
      try {
        await createUserWithEmailAndPassword(auth, emailLowerCased, password);
        const userInfo: UserInfo = {
          firstName: firstName,
          lastName: lastName,
          certificatesCompleted: { facilitator: false, learner: false },
          displayName: displayName,
          displayNameLowerCase: displayName.toLowerCase(),
          blockedUserIds: [],
        };
        createUserAccountInfo(dispatch, userInfo);
        Toast.show({
          type: "success",
          text1: "Account successfully created",
        });
        dispatch(updateIsSignedIn(true));
      } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        Toast.show({
          type: "error",
          text1: "An error occurred while creating an account",
        });
      }
    }
  };

  //
  const displayNameCheckDebounced = useCallback(
    debounce(async () => {
      if (displayName === "") return;
      console.log("checking...");
      const isAvailable = await checkIfDisplayNameIsAvailable(displayName);
      setDisplayNameAvailable(isAvailable);
      console.log(isAvailable);
      setLoadingDisplayNameCheck(false);
    }, 2000),
    [],
  );

  useEffect(() => {
    setLoadingDisplayNameCheck(true);
    displayNameCheckDebounced();
  }, [displayName]);

  useEffect(() => {
    console.log('"' + email + '"');
  }, [email]);

  // Update email and verify it is valid
  const handleEmail = (email: string) => {
    // Remove leading and trailing white spaces
    const sanitizedEmail = email.trim();
    setEmail(sanitizedEmail);
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    setEmailValid(emailRegex.test(sanitizedEmail));
  };
  console.log(displayName);

  return (
    <ScrollView className="bg-primary" keyboardShouldPersistTaps="handled">
      <View className="py-safe mb-5">
        <View className="flex w-full items-center">
          <Image
            source={require("@/assets/images/our-daily-bread-logo.png")}
            className="size-56"
            resizeMode="contain"
          />
        </View>
        {/* Form Section*/}
        <View>
          <View className="mx-3 rounded-md border border-odbm-gray bg-pop p-6">
            <Text className="py-3 text-center text-3xl font-bold tracking-wider text-textColor-primary">
              Create an Account
            </Text>
            <View className="gap-3">
              {/* Display Name Section */}
              <View>
                <StyledLabel label="Display Name" />
                <StyledTextInput
                  containerClassName={cn(
                    displayName === "" && "border border-red-600",
                  )}
                  onChangeText={(text) => {
                    setDisplayName(text.trim());
                  }}
                  placeholder="Crunche"
                />
                {displayName === "" && (
                  <ErrorText>Enter a Display name.</ErrorText>
                )}
                {loadingDisplayNameCheck && displayName !== "" && (
                  <InfoText className="text-yellow-400">
                    Checking if display name is available...
                  </InfoText>
                )}
                {displayNameAvailable === true && displayName !== "" && (
                  <InfoText className="text-green-500">
                    Display name is available.
                  </InfoText>
                )}
                {displayNameAvailable === false && displayName !== "" && (
                  <ErrorText>
                    Display name is unavailable. Please choose another name.
                  </ErrorText>
                )}
              </View>
              {/* First Name Section */}
              <View>
                <StyledLabel label="First Name" />
                <StyledTextInput
                  containerClassName={cn(
                    firstName === "" && "border border-red-600",
                  )}
                  onChangeText={(text) => {
                    setFirstName(text.trim());
                  }}
                  placeholder="John"
                  autoComplete="given-name"
                />
                {firstName === "" && (
                  <ErrorText>Enter your first name.</ErrorText>
                )}
              </View>
              {/* Last Name Section */}
              <View>
                <StyledLabel label="Last Name" />
                <StyledTextInput
                  containerClassName={cn(
                    lastName === "" && "border border-red-600",
                  )}
                  onChangeText={(text) => {
                    setLastName(text.trim());
                  }}
                  placeholder="Doe"
                  autoComplete="family-name"
                />
                {lastName === "" && (
                  <ErrorText>Enter your last name.</ErrorText>
                )}
              </View>
              {/* Email Section */}
              <View className="">
                <StyledLabel label="Email" />
                <StyledTextInput
                  containerClassName={cn(
                    !emailValid && "border border-red-600",
                  )}
                  onChangeText={handleEmail}
                  keyboardType="email-address"
                  placeholder="example@email.com"
                  autoComplete="email"
                />
                {!emailValid && <ErrorText>Email is invalid.</ErrorText>}
              </View>
              {/* Password Section */}
              <View>
                <StyledLabel label="Password" />
                <SecureTextInput
                  placeholder="Password"
                  onChangeText={setPassword}
                />
              </View>
              {/* Password Validation Section */}
              <View>
                <PasswordValidation status={passwordStatus} />
              </View>
            </View>
            <CustomOpacityButton
              title="Sign Up!"
              onPress={handleRegister}
              className="w-full"
            />
            {/* Register account redirect */}
            <TouchableOpacity
              onPress={() => {
                router.push("/(auth)/signIn");
              }}
            >
              <Text className="text-textColor-primary">
                Already have an account?{" "}
                <Text className="text-highlight">Sign in here</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default Register;

interface ValidationStatus {
  status: PasswordValidationStatusMutable | undefined;
}

/**
 *
 * @param status Contains the state of the password validation status
 * @returns Returns a list of requirements in text that display the status of the password.
 */
const PasswordValidation = ({ status }: ValidationStatus) => {
  if (status === undefined) return;
  return (
    <>
      <StyledValidationText isValid={status.containsUppercaseLetter}>
        Must contain an uppercase character
      </StyledValidationText>
      <StyledValidationText isValid={status.containsLowercaseLetter}>
        Must contain a lowercase character
      </StyledValidationText>
      <StyledValidationText isValid={status.containsNonAlphanumericCharacter}>
        Must contain a special character
      </StyledValidationText>
      <StyledValidationText isValid={status.containsNumericCharacter}>
        Must contain a number
      </StyledValidationText>
      <StyledValidationText isValid={status.meetsMinPasswordLength}>
        Must be {PASSWORD_MIN_LEN.toString()}-{PASSWORD_MAX_LEN.toString()}{" "}
        characters long
      </StyledValidationText>
    </>
  );
};

interface ValidationText {
  isValid: boolean | undefined;
  children: string | string[];
}
const StyledValidationText = ({ isValid, children }: ValidationText) => {
  return (
    <View className="flex flex-row items-center">
      <View className="pr-3">
        {isValid ? (
          <FontAwesome6 name="check" size={18} color="#16a34a" />
        ) : (
          <FontAwesome6 name="xmark" size={18} color="#dc2626" />
        )}
      </View>
      <ErrorText
        hasError={!isValid}
        className={cn(isValid && "text-green-600")}
      >
        {children}
      </ErrorText>
    </View>
  );
};
