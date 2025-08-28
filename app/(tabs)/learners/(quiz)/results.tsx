import CustomOpacityButton from "@/components/customOpacityButton";
import { useAppSelector } from "@/redux/hooks";
import cn from "@/utility_functions/cn";
import { router } from "expo-router";
import { View, Text } from "react-native";
const Results = () => {
  const recommendedStart = useAppSelector(
    (state) => state.quiz.recommendedStart
  );
  const contentTextClassName = "dark:text-white text-center";

  const onContinue = () => {
    router.replace("/(tabs)/learners");
  };
  return (
    <View className="py-safe px-5 flex-1 flex bg-odbm-light dark:bg-odbm-gray-digital items-center justify-center">
      <View className="">
        <Text className={cn(contentTextClassName, "font-bold text-2xl")}>
          Congratulations on finishing the quiz!
        </Text>
        <Text className={cn(contentTextClassName, "text-lg")}>
          {"\n"}Based on your results, we recommend that you start at the{" "}
          <Text className="text-odbm-gold font-extrabold">
            {recommendedStart}
          </Text>{" "}
          section.
        </Text>
      </View>
      <CustomOpacityButton
        onPress={onContinue}
        title="Continue"
        className="w-full mt-16"
      />
    </View>
  );
};
export default Results;
