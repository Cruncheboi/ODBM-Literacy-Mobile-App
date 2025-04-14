import { useEffect, useRef, useState } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import { useColorScheme } from "nativewind";
import CustomOpacityButton from "./customOpacityButton";

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
  };

  const onNextQuestion = () => {
    // user must select an answer before proceeding
    if (selectedAnswer === null) return;
    setQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const onPrevQuestion = () => {
    setQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <View className="flex-col gap-2">
      <Text className="dark:text-white font-semibold">
        Question {questionIndex + 1}
      </Text>
      {/* Quiz Question */}
      <Text className="text-lg line mb-2 dark:text-white">
        {questions[questionIndex].question}
      </Text>
      {/* Quiz Answers */}
      {questions[questionIndex].choices.map((choice, index) => {
        return (
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor={colorScheme === "dark" ? "#334155" : "#94a3b8"}
            key={index}
            className={`rounded-xl p-1 border border-l-[3px] border-r-2 border-b-[4px] border-slate-400 dark:border-slate-600 h-14 ${
              selectedAnswer === index
                ? "bg-slate-400 dark:bg-slate-600"
                : "bg-odbm-light dark:bg-slate-800"
            }`}
            onPress={() => onAnswerSelect(index)}
          >
            <View className="flex items-center justify-center flex-1">
              <Text className="dark:text-white">{choice}</Text>
            </View>
          </TouchableHighlight>
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
