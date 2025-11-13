import { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { updateIsSignedIn } from "@/redux/features/usersSlice";
import { useAppDispatch } from "@/redux/hooks";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import CustomOpacityButton from "@/components/customOpacityButton";
import SecureTextInput from "@/components/secureTextInput";
import StyledTextInput from "@/components/styledTextInput";
import StyledLabel from "@/components/styledLabel";
import ErrorText from "@/components/errorText";
import { clsx } from "clsx";
import { router } from "expo-router";
import { updateCurrentUserInfo } from "@/redux/storageSync";
import { getCurrentUserInfo } from "@/firebase_functions/firebaseFunctions";

const SignIn = () => {
  // Form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  // Storage
  const dispatch = useAppDispatch();

  // Signs the user in with email and password, and updates stored user info
  const handleSignIn = async () => {
    if (!emailValid) {
      return;
    }
    const emailLowerCased = email.toLowerCase();
    signInWithEmailAndPassword(auth, emailLowerCased, password)
      // Update user info and redirect to home page
      .then(async (userCredential) => {
        setIsLoading(true);
        const userInfo = await getCurrentUserInfo();
        if (userInfo == null) return;
        updateCurrentUserInfo(dispatch, userInfo);
        dispatch(updateIsSignedIn(true));
        setIsLoading(false);
        router.replace("/(tabs)/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const handleEmail = (email: string) => {
    setEmail(email);
    // Verify email is valid
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    setEmailValid(emailRegex.test(email));
  };

  return (
    <ScrollView
      className="bg-odbm-light dark:bg-odbm-gray-digital"
      keyboardShouldPersistTaps="handled"
    >
      <View className="py-safe">
        <View className="w-full flex items-center">
          <Image
            source={require("@/assets/images/our-daily-bread-logo.png")}
            className="size-56"
            resizeMode="contain"
          />
        </View>
        {/* Form Section*/}
        <View className="mx-3">
          <View className="p-6 border rounded-md border-odbm-gray bg-gray-50 dark:bg-odbm-gray-dark">
            <Text className="dark:color-white text-center text-3xl font-bold py-3 tracking-widest">
              Sign In
            </Text>
            <View className="gap-3">
              {/* Email Section */}
              <View>
                <StyledLabel label="Email" />
                <StyledTextInput
                  containerClassName={clsx(
                    !emailValid && "border border-red-600"
                  )}
                  onChangeText={handleEmail}
                  keyboardType="email-address"
                  placeholder="example@email.com"
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
            </View>
            <CustomOpacityButton
              title="Sign In"
              onPress={handleSignIn}
              className="w-full bg-white dark:bg-odbm-gold"
            />
            {/* Register account redirect */}
            <TouchableOpacity
              onPress={() => {
                router.push("/(auth)/register");
              }}
            >
              <Text className="dark:text-white">
                Don't have an account?{" "}
                <Text className="text-odbm-gold">Register here</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default SignIn;
