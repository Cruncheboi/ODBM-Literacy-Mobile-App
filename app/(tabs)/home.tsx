import { View, Text } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import CustomOpacityButton from "@/components/customOpacityButton";
import { auth } from "@/firebaseConfig";
import { router } from "expo-router";
import CustomNavigationButton from "@/components/customNavigationButton";

const Home = () => {
  const username = useAppSelector((state) => state.users.firstName);
  const signedIn = useAppSelector((state) => state.users.isSignedIn);
  const email = useAppSelector((state) => state.users.email);

  return (
    <View className="flex-1 px-5 dark:bg-odbm-gray-digital py-safe">
      <Text className="dark:text-white text-2xl">Welcome, {username}!</Text>
      <Text className="dark:color-white">{username}</Text>
      <Text className="dark:color-white">{"" + signedIn}</Text>
      <Text className="dark:color-white">{"" + email}</Text>
      <Text className="dark:color-white">{"" + auth.currentUser?.uid}</Text>
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
