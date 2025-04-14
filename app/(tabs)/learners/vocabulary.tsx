import CustomOpacityButton from "@/components/customOpacityButton";
import { router } from "expo-router";
import { View } from "react-native";

const sources = [
  {
    name: "Vocab A",
    source: {
      uri: "https://drive.google.com/file/d/1JTSBP7gx3Vk1UvMJc7-mDOxPmQKkVwmI/view?usp=drive_link",
    },
  },
  {
    name: "Vocab B",
    source: {
      uri: "https://drive.google.com/file/d/1jez4iBC_oOHxa2YsPW-NQZS1AX8xyFJa/view?usp=drive_link",
    },
  },
  {
    name: "Vocab C",
    source: {
      uri: "https://drive.google.com/file/d/1h-v_n_KtswBOJw-DIl8H6WfPjD9c2p5V/view?usp=drive_link",
    },
  },
  {
    name: "Vocab D",
    source: {
      uri: "https://drive.google.com/file/d/1ANcaZlX_gBcovGBWwVAZGEAWWrsjyCf4/view?usp=drive_link",
    },
  },
];

const Vocabulary = () => {
  return (
    <View className="flex-1 w-full bg-gray-800 justify-start items-center">
      {sources.map(({ name, source }) => {
        return (
          <CustomOpacityButton
            key={name}
            title={name}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/learners/(pdfs)/pdfViewer",
                params: source,
              })
            }
          />
        );
      })}
    </View>
  );
};
export default Vocabulary;
