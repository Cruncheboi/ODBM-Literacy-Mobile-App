import { useEffect, useRef, useState } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import { useColorScheme } from "nativewind";
import CustomOpacityButton from "./customOpacityButton";
import Animated, {
  FadeInLeft,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import cn from "@/utility_functions/cn";
import { router } from "expo-router";

export interface Quiz {
  questions: {
    question: string;
    choices: string[];
    answerIndex: number;
  }[];
  /**
   * Handles what happens after a quiz has been submitted.
   * @param numCorrect Number of correct answers in the quiz.
   * @returns
   */
  onSubmitQuiz: (numCorrect: number) => void;
}

const Quiz = ({ questions, onSubmitQuiz }: Quiz) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const answers = useRef<number[]>(new Array(questions.length));
  const { colorScheme } = useColorScheme();

  // Update current selected answer when question is changed
  useEffect(() => {
    setSelectedAnswer(answers.current[questionIndex]);
  }, [questionIndex]);

  useEffect(() => {
    console.log("UE-ANS: " + answers.current);
  }, [selectedAnswer]);

  const allQuestionsAreAnswered = (): boolean => {
    // Ensure all
    for (let i = 0; i < questions.length; i++) {
      if (answers.current[i] == undefined) return false;
    }
    return true;
  };

  // Implement quiz check
  const onSubmit = () => {
    // console.log(answers.current[2]);
    if (!allQuestionsAreAnswered()) return;

    // console.log(!answers.current.every((value) => value != undefined));
    // if (!answers.current.every((value) => value != undefined)) return;
    console.log("submitting...");
    let numOfCorrectAnswers = 0;
    for (let i = 0; i < answers.current.length; i++) {
      if (questions[i].answerIndex == answers.current[i]) {
        numOfCorrectAnswers++;
      }
    }
    console.log(numOfCorrectAnswers);
    onSubmitQuiz(numOfCorrectAnswers);
  };

  /**
   * Updates the user's selected choice to be the passed index
   * @param index Index of the chosen answer from the question
   */
  const onAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    answers.current[questionIndex] = index;
    console.log("Answer selected: " + index);
  };

  /**
   * Sets the current question to be the next one in the list of questions
   */
  const setNextQuestionIndex = () => {
    setQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
    console.log(selectedAnswer);
  };

  /**
   * Sets the current question to display to be the previous one in the list of questions
   */
  const setPrevQuestionIndex = () => {
    setQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  // ANIMATION FUNCTIONS
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const reduceMotionConfig = { reduceMotion: ReduceMotion.System };

  /**
   * Displays an animation when choosing to go to the next question
   */
  const onNextQuestion = () => {
    opacity.value = withSequence(
      withTiming(0, reduceMotionConfig, () => {
        runOnJS(setNextQuestionIndex)();
      }),
      withTiming(1, reduceMotionConfig),
    );
  };

  /**
   * Displays an animation when choosing to go to the previous question
   */
  const onPrevQuestion = () => {
    opacity.value = withSequence(
      withTiming(0, reduceMotionConfig, () => {
        runOnJS(setPrevQuestionIndex)();
      }),
      withTiming(1, reduceMotionConfig),
    );
  };

  const animatedChoiceStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View className="flex-col gap-2">
      <Animated.Text style={animatedChoiceStyles}>
        <Animated.Text
          className="font-semibold dark:text-white"
          entering={FadeInLeft.delay(200)}
        >
          Question {questionIndex + 1}
        </Animated.Text>
      </Animated.Text>
      {/* Quiz Question */}
      <Animated.Text style={animatedChoiceStyles}>
        <Animated.Text
          className="line mb-2 text-lg dark:text-white"
          entering={FadeInLeft.delay(300)}
        >
          {questions[questionIndex].question}
        </Animated.Text>
      </Animated.Text>
      {/* Quiz Answer Choices */}
      {questions[questionIndex].choices.map((choice, index) => {
        return (
          <Animated.View
            key={index}
            entering={FadeInLeft.delay(300 + 50 * index).springify()}
          >
            <Animated.View style={animatedChoiceStyles}>
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor={colorScheme === "dark" ? "#FAB432" : "#6DACDE"}
                className={cn(
                  "h-14 rounded-xl border border-b-[4px] border-l-[3px] border-r-2 border-borderColor-primary px-2 py-1 dark:border-textColor-body",
                  selectedAnswer === index
                    ? "bg-highlight"
                    : "bg-bgColor-primary dark:bg-borderColor-primary",
                )}
                onPress={() => onAnswerSelect(index)}
              >
                <View className="flex flex-1 items-center justify-center">
                  <Text className="text-textColor-primary">{choice}</Text>
                </View>
              </TouchableHighlight>
            </Animated.View>
          </Animated.View>
        );
      })}
      {/* Quiz Navigation */}
      <View className="flex w-full flex-row gap-1">
        {questionIndex !== 0 && (
          // Previous Question Button
          <CustomOpacityButton
            className="flex-1 rounded-r-none bg-primary"
            title="Previous"
            onPress={onPrevQuestion}
          />
        )}
        {questionIndex === questions.length - 1 ? (
          // Submit Button
          <CustomOpacityButton
            disabled={
              selectedAnswer === undefined || !allQuestionsAreAnswered()
            }
            className={`flex-1 bg-green-500 ${
              questionIndex !== 0 && "rounded-l-none"
            }`}
            title="Submit"
            onPress={onSubmit}
          />
        ) : (
          // Next Question Button
          <CustomOpacityButton
            disabled={selectedAnswer === undefined}
            className={`flex-1 bg-highlight ${
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
