import CustomOpacityButton from "@/components/customOpacityButton";
import { router, useNavigation } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";

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

const VocabPage = () => {
  // const navigation = useNavigation();
  // console.log(navigation.getState()?.history);
  return (
    <View className="flex-1 w-full bg-gray-800 justify-start items-center">
      {/* <Text className="text-5xl underline text-highlight font-bold mt-10">
        Vocabulary
      </Text> */}
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
export default VocabPage;
