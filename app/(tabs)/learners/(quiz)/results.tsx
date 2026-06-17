import CustomOpacityButton from "@/components/customOpacityButton";
import { useAppSelector } from "@/redux/hooks";
import cn from "@/utility_functions/cn";
import { router } from "expo-router";
import { View, Text } from "react-native";

const Results = () => {
  const recommendedStart = useAppSelector(
    (state) => state.quiz.recommendedStart,
  );
  const contentTextClassName = "dark:text-white text-center";

  const onContinue = () => {
    router.replace("/(tabs)/learners");
  };
  return (
    <View className="py-safe flex flex-1 items-center justify-center bg-primary px-5">
      <View className="">
        <Text className={cn(contentTextClassName, "text-2xl font-bold")}>
          Congratulations on finishing the quiz!
        </Text>
        <Text className={cn(contentTextClassName, "text-lg")}>
          {"\n"}Based on your results, we recommend that you start at the{" "}
          <Text className="font-extrabold text-odbm-gold">
            {recommendedStart}
          </Text>{" "}
          section.
        </Text>
      </View>
      <CustomOpacityButton
        onPress={onContinue}
        title="Continue"
        className="mt-16 w-full"
      />
    </View>
  );
};
export default Results;
