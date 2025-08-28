import CustomHeader from "@/components/customHeader";
import { useAppSelector } from "@/redux/hooks";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
const Profile = () => {
  const firstName = useAppSelector((state) => state.users.firstName);
  const email = useAppSelector((state) => state.users.email);
  return (
    <CustomHeader title="Profile">
      <ScrollView className="dark:bg-odbm-gray-digital px-5 w-full">
        {/* <View className="mt-4 w-full">
          <Text className="dark:text-white text-3xl">Hello</Text>
        </View> */}
        <InfoBox />
      </ScrollView>
    </CustomHeader>
  );
};
export default Profile;

const InfoBox = () => {
  return (
    <View className="h-28 w-full flex-row">
      <Text className="dark:text-white text-2xl">First Name </Text>
      <Text className="dark:text-white text-2xl">Leonardo</Text>
    </View>
  );
};
