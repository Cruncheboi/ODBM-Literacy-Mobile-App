import CustomOpacityButton from "@/components/customOpacityButton";
import { useColorScheme } from "nativewind";
import { View, Text, Switch } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useAppDispatch } from "@/redux/hooks";
import { resetUser, updateIsSignedIn } from "@/redux/features/usersSlice";
import { router } from "expo-router";

const Settings = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const dispatch = useAppDispatch();
  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Successfully signed out.");
        dispatch(resetUser());
        dispatch(updateIsSignedIn(false));
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };
  return (
    <View className="flex-1 flex justify-start items-center py-safe px-6 dark:bg-odbm-gray-digital">
      <View className="flex-row gap-5">
        <Text className="dark:text-white text-lg">Switch Default Theme</Text>
        <Switch
          value={colorScheme == "light"}
          onValueChange={toggleColorScheme}
        />
      </View>
      <CustomOpacityButton
        title="Profile"
        onPress={() => {
          router.push("/(tabs)/settings/(userInfo)/profile");
        }}
        textStyles="text-odbm-gray"
      />
      <CustomOpacityButton
        title="Sign Out"
        onPress={signOutUser}
        textStyles="text-odbm-gray"
      />
    </View>
  );
};
export default Settings;
