import { View, Text, Animated, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
// import "@/styles/homeStyles.css";
const Home = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <SafeAreaView className="flex-1 dark:bg-odbm-gray-digital"></SafeAreaView>
  );
};
export default Home;
