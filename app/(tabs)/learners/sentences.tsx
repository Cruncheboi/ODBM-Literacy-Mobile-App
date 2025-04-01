import CustomOpacityButton from "@/components/customOpacityButton";
import { router } from "expo-router";
import { View, Text } from "react-native";
const sources = [
  {
    name: "Easy Sentences",
    source: {
      uri: "https://drive.google.com/file/d/1ynygpcgliovkn_kxf3x7Hb1WBsPRsfaW/view?usp=drive_link",
    },
  },
  {
    name: "Medium Sentences A",
    source: {
      uri: "https://drive.google.com/file/d/16I28AGhdI1ZiiDd40hz0x4lTC_1ZoKsv/view?usp=drive_link",
    },
  },
  {
    name: "Medium Sentences B",
    source: {
      uri: "https://drive.google.com/file/d/1M_T3PZz3nFwPX5TSGHDR92YQsr5KQD9b/view?usp=drive_link",
    },
  },
  {
    name: "Hard Sentences",
    source: {
      uri: "https://drive.google.com/file/d/1sGUGMJ-HqiitC0PQA9XF1AklwSRphuFi/view?usp=drive_link",
    },
  },
];
const Sentences = () => {
  return (
    <View className="flex-1 bg-odbm-gray-digital justify-start items-center">
      <Text className="text-odbm-gray-light text-xl">Sentences</Text>
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
export default Sentences;
