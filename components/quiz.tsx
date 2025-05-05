import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import { useColorScheme } from "nativewind";
import CustomOpacityButton from "./customOpacityButton";
import Animated, {
  Easing,
  FadeInLeft,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "expo-router";
import cn from "@/utility_functions/cn";

export interface Quiz {
  questions: {
    question: string;
    choices: string[];
    answerIndex: number;
  }[];
}

const Quiz = ({ questions }: Quiz) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const answers = useRef<(number | null)[]>(new Array(questions.length));
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    setSelectedAnswer(answers.current[questionIndex]);
  }, [questionIndex]);

  // useFocusEffect(() => {
  //   useCallback(() => {
  //     // Invoked whenever the route is focused.
  //     console.log("Hello, I'm focused!");
  //     // console.log(selectedAnswer);
  //     // console.log(questionIndex);

  //     // Return function is invoked whenever the route gets out of focus.
  //     return () => {
  //       console.log("This route is now unfocused.");
  //     };
  //   }, []);
  // });

  useEffect(() => {
    console.log("UE-ANS: " + answers.current);
  }, [selectedAnswer]);

  // Implement quiz check
  const onSubmit = () => {
    console.log("submitting...");
    console.log(selectedAnswer);
  };

  const onAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    answers.current[questionIndex] = index;
    console.log("Answer selected: " + index);
  };

  const onNextQuestion = () => {
    // user must select an answer before proceeding
    if (selectedAnswer === null) return;
    // setQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
    // setNextQuestionIndex();
    nextChoiceAnimations();
  };

  const onPrevQuestion = () => {
    // setPrevQuestionIndex();
    prevChoiceAnimations();
  };

  const setNextQuestionIndex = () => {
    console.log("setNextQuestionIndex");
    setQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };
  const setPrevQuestionIndex = () => {
    console.log("setPrevQuestionIndex");
    setQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  // ANIMATION FUNCTIONS
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const reduceMotionConfig = { reduceMotion: ReduceMotion.System };

  const nextChoiceAnimations = () => {
    // translateX.value = withSequence(
    //   withTiming(translateX.value - 300, reduceMotionConfig, () => {
    //     runOnJS(setNextQuestionIndex)();
    //   }),
    //   withTiming(300, { duration: 0, ...reduceMotionConfig }),
    //   withTiming(0, reduceMotionConfig)
    //   // withSpring(0)
    // );
    opacity.value = withSequence(
      withTiming(0, reduceMotionConfig, () => {
        runOnJS(setNextQuestionIndex)();
      }),
      withTiming(1, reduceMotionConfig)
    );
  };

  const prevChoiceAnimations = () => {
    // translateX.value = withSequence(
    //   withTiming(translateX.value + 300, reduceMotionConfig, () => {
    //     runOnJS(setPrevQuestionIndex)();
    //   }),
    //   withTiming(-300, { duration: 0, ...reduceMotionConfig }),
    //   withTiming(0, reduceMotionConfig)
    //   // withSpring(0)
    // );
    opacity.value = withSequence(
      withTiming(0, reduceMotionConfig, () => {
        runOnJS(setPrevQuestionIndex)();
      }),
      withTiming(1, reduceMotionConfig)
    );
  };

  const animatedChoiceStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View className="flex-col gap-2">
      <Animated.Text style={animatedChoiceStyles}>
        <Animated.Text
          className="dark:text-white font-semibold"
          entering={FadeInLeft.delay(200)}
        >
          Question {questionIndex + 1}
        </Animated.Text>
      </Animated.Text>
      {/* Quiz Question */}
      <Animated.Text style={animatedChoiceStyles}>
        <Animated.Text
          className="text-lg line mb-2 dark:text-white"
          entering={FadeInLeft.delay(300)}
        >
          {questions[questionIndex].question}
        </Animated.Text>
      </Animated.Text>
      {/* Quiz Answers */}
      {questions[questionIndex].choices.map((choice, index) => {
        return (
          <Animated.View
            key={index}
            entering={FadeInLeft.delay(300 + 50 * index).springify()}
          >
            <Animated.View style={animatedChoiceStyles}>
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor={colorScheme === "dark" ? "#334155" : "#94a3b8"}
                className={cn(
                  "rounded-xl p-1 border border-l-[3px] border-r-2 border-b-[4px] border-slate-400 dark:border-slate-600 h-14",
                  selectedAnswer === index
                    ? "bg-slate-400 dark:bg-slate-600"
                    : "bg-odbm-light dark:bg-slate-800"
                )}
                onPress={() => onAnswerSelect(index)}
              >
                <View className="flex items-center justify-center flex-1">
                  <Text className="dark:text-white">{choice}</Text>
                </View>
              </TouchableHighlight>
            </Animated.View>
          </Animated.View>
        );
      })}
      {/* Quiz Navigation */}
      <View className="w-full flex flex-row gap-1">
        {questionIndex !== 0 && (
          <CustomOpacityButton
            className="flex-1 rounded-r-none bg-odbm-light dark:bg-slate-800"
            title="Previous"
            onPress={onPrevQuestion}
          />
        )}
        {questionIndex === questions.length - 1 ? (
          // Submit Button
          <CustomOpacityButton
            disabled={
              selectedAnswer === undefined ||
              (questionIndex === questions.length - 1 &&
                !answers.current.every((value) => value != undefined))
            }
            className={`flex-1 bg-green-500 ${
              questionIndex !== 0 && "rounded-l-none"
            }`}
            title="Submit"
            onPress={onSubmit}
          />
        ) : (
          <CustomOpacityButton
            disabled={selectedAnswer === undefined}
            className={`flex-1 bg-odbm-light dark:bg-slate-600 ${
              questionIndex !== 0 && "rounded-l-none"
            }`}
            title="Next"
            onPress={onNextQuestion}
          />
        )}
      </View>
    </View>
  );
};
export default Quiz;
