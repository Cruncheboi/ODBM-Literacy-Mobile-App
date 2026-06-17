import { View, Text } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import CustomOpacityButton from "@/components/customOpacityButton";
import { auth } from "@/firebaseConfig";
import { router } from "expo-router";

const Home = () => {
  const username = useAppSelector((state) => state.users.firstName);
  const signedIn = useAppSelector((state) => state.users.isSignedIn);
  const email = useAppSelector((state) => state.users.email);

  return (
    <View className="py-safe flex-1 bg-primary px-5">
      <Text className="text-2xl dark:text-white">Welcome, {username}!</Text>
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
