import { View, Text } from "react-native";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import CustomOpacityButton from "@/components/customOpacityButton";
import { updateFirstName } from "@/redux/features/usersSlice";
import { auth, isSignedIn } from "@/firebaseConfig";
import { useEffect } from "react";
import { router } from "expo-router";

const Home = () => {
  const username = useAppSelector((state) => state.users.firstName);
  const signedIn = useAppSelector((state) => state.users.isSignedIn);
  const email = useAppSelector((state) => state.users.email);
  const dispatch = useAppDispatch();

  const handleUpdateFirstName = () => {
    dispatch(updateFirstName("Leo"));
  };

  return (
    <View className="flex-1 px-5 dark:bg-odbm-gray-digital py-safe">
      <Text className="dark:text-white text-2xl">Welcome, {username}!</Text>
      <Text className="dark:color-white">{username}</Text>
      <Text className="dark:color-white">{"" + signedIn}</Text>
      <Text className="dark:color-white">{"" + email}</Text>
      <Text className="dark:color-white">{"" + auth.currentUser?.uid}</Text>
      <CustomOpacityButton
        onPress={handleUpdateFirstName}
        title="update name"
      />
      <CustomOpacityButton
        onPress={() => {
          router.push("/(auth)/register");
        }}
        title="Register"
      />
      <CustomOpacityButton
        onPress={() => {
          router.push("/(auth)/signIn");
        }}
        title="Sign In"
      />
    </View>
  );
};
export default Home;
