import CustomHeader from "@/components/customHeader";
import CustomOpacityButton from "@/components/customOpacityButton";
import Quiz from "@/components/quiz";
import { router } from "expo-router";
import React, { createContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";

const passage = {
  book: "Mark",
  chapter: 6,
  verses: [
    {
      verseNumber: 30,
      verse: `The apostles came to Jesus and told him all that they had done and taught.`,
    },
    {
      verseNumber: 31,
      verse: `Then Jesus said, "Come to a place by yourselves and rest for a while." For many were coming and going, and they did not even have time to eat.`,
    },
    {
      verseNumber: 32,
      verse: `So they went away in the boat to a place by themselves.`,
    },
    {
      verseNumber: 33,
      verse: `But the people saw them leaving and could see who they were, and they all ran on foot from all the villages, and they arrived there before them.`,
    },
    {
      verseNumber: 34,
      verse: `When Jesus and the apostles boat came ashore, Jesus saw the many people and he felt sadness for them because they were like sheep without a shepherd. So, Jesus began to teach them many things.`,
    },
    {
      verseNumber: 35,
      verse: `When it was very late, the disciples came to Jesus and said, "This place is far from any villages, and it is already late.`,
    },
    {
      verseNumber: 36,
      verse: `Send them away so that they may go into the nearby countryside and villages to buy something to eat for themselves."`,
    },
    {
      verseNumber: 37,
      verse: `But Jesus said to them, "You give them something to eat." The disciples said to him, "Can we go and buy over half a year's pay of bread and give it to them to eat?"`,
    },
    {
      verseNumber: 38,
      verse: `Jesus said to them, "How many loaves do you have? Go and see." When they found out, they said, "Five loaves and two fish.”`,
    },
    {
      verseNumber: 39,
      verse: `Jesus told all the people to sit down in groups upon the green grass.`,
    },
    {
      verseNumber: 40,
      verse: `The people sat down in groups of hundreds and fifties.`,
    },
    {
      verseNumber: 41,
      verse: `Jesus took the five loaves of bread and the two fish and looking up to heaven he blessed and broke the loaves and gave them to the disciples to set before the people. He also divided the two fish among them all.`,
    },
    {
      verseNumber: 42,
      verse: `They all ate until they were satisfied.`,
    },
    {
      verseNumber: 43,
      verse: `They took up broken pieces of bread, twelve baskets full, and also pieces of the fish.`,
    },
    {
      verseNumber: 44,
      verse: `There were five thousand men who ate the loaves of bread.`,
    },
    {
      verseNumber: 45,
      verse: `Right away Jesus made his disciples get into the boat and go ahead of him to the other side, to Bethsaida, while he sent the crowd away.`,
    },
    {
      verseNumber: 46,
      verse: `Jesus left them and went up the mountain to pray.`,
    },
    {
      verseNumber: 47,
      verse: `Evening came, and the boat was now in the middle of the sea, and Jesus was alone on land.`,
    },
    {
      verseNumber: 48,
      verse: `Jesus saw the disciples rowing hard, for the wind was against them. In the middle of the night, he came to them, walking on the sea, and he wanted to pass by them.`,
    },
    {
      verseNumber: 49,
      verse: `But when the disciples saw Jesus, walking on the sea, they thought he was a ghost and cried out,`,
    },
    {
      verseNumber: 50,
      verse: `because they saw him and were troubled. Right away Jesus spoke to them and said, "Be strong! It is I! Do not be afraid!"`,
    },
    {
      verseNumber: 51,
      verse: `Jesus got into the boat with them, and the wind stopped blowing. They were amazed.`,
    },
    {
      verseNumber: 52,
      verse: `For they had not understood what the loaves of bread meant. Instead, their hearts were hard.`,
    },
    {
      verseNumber: 53,
      verse: `When they had gone over the sea, they came to land at Gennesaret and anchored the boat.`,
    },
    {
      verseNumber: 54,
      verse: `When they came out of the boat, the people saw it was Jesus right away,`,
    },
    {
      verseNumber: 55,
      verse: `and they ran to the villages around them and began to bring the sick on their mats to wherever they heard Jesus was.`,
    },
    {
      verseNumber: 56,
      verse: `Wherever he entered into villages, or cities, or into the country, people would put the sick in the marketplaces. They begged Jesus to let them touch the edge of his clothing, and all who touched him were healed.`,
    },
  ],
};

const quiz = [
  {
    question:
      "After the apostles returned, what did Jesus suggest they do because they were so busy?",
    choices: [
      "Go and preach to more villages.",
      "Go to a place by themselves and rest.",
      "Prepare a large meal for the crowd.",
      "Return home to their families.",
    ],
    answerIndex: 1,
  },
  {
    question:
      "When the disciples suggested sending the hungry crowd away, what was Jesus' initial response?",
    choices: [
      "He agreed and told them to leave quickly.",
      "He asked how much money they had to buy food.",
      `He told them, "You give them something to eat."`,
      "He began to teach the crowd for a longer time.",
    ],
    answerIndex: 1,
  },
  {
    question:
      "The passage states that after Jesus walked on water and got into the boat, the wind stopped, and the disciples were amazed. What reason is given in the text for their amazement despite witnessing the feeding of the five thousand?",
    choices: [
      "They believed walking on water was a greater miracle than feeding the crowd.",
      "They had forgotten about the miracle of the loaves.",
      "They had not understood the significance of the miracle of the loaves; their hearts were hard.",
      "They were simply surprised that Jesus had followed them onto the sea.",
    ],
    answerIndex: 1,
  },
];

type Passage = {
  book: string;
  chapter: number;
  verses: {
    verseNumber: number;
    verse: string;
  }[];
};

export const PassageContext = createContext<Passage>(passage);

const Assesment = () => {
  return (
    <PassageContext.Provider value={passage}>
      {/* <CustomHeader
        title="Placement Assessment"
        contentContainerClassName="w-full bg-black"
      > */}
      <ScrollView
        className="flex-1 dark:bg-odbm-gray-digital"
        contentContainerStyle={styles.container}
      >
        {/* Passage */}
        <View className="w-10/12 mt-2 justify-start gap-5">
          <View className="gap-2">
            <Animated.Text
              className="dark:text-white text-xl"
              entering={FadeInLeft.delay(100)}
            >
              Read the passage below from
              {"\n"}
              {passage.book} {passage.chapter}:{passage.verses[0].verseNumber}-
              {passage.verses[passage.verses.length - 1].verseNumber}.
            </Animated.Text>
            <CustomOpacityButton
              title="View Passage"
              className="w-full bg-odbm-light dark:bg-slate-600"
              onPress={() => {
                router.push("/(tabs)/learners/(quiz)/passageViewer");
              }}
            />
          </View>
        </View>
        <View className="w-10/12 flex-1 justify-end">
          <Quiz questions={quiz} />
        </View>
      </ScrollView>
      {/* </CustomHeader> */}
    </PassageContext.Provider>
  );
};
export default Assesment;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    flexGrow: 1,
  },
});
