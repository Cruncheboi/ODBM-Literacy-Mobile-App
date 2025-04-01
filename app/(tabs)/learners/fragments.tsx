import CustomOpacityButton from "@/components/customOpacityButton";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
const sources = [
  {
    name: "Fragment A",
    source: {
      uri: "https://drive.google.com/file/d/1n6Bc4mLVr74S0dBUL5OSjj4yoBXoFqnC/view?usp=drive_link",
    },
  },
  {
    name: "Fragment B",
    source: {
      uri: "https://drive.google.com/file/d/1dpPM795GrhECXldzlImPWYQgj73_ht6W/view?usp=drive_link",
    },
  },
  {
    name: "Fragment C",
    source: {
      uri: "https://drive.google.com/file/d/1aqCoVfwe5cIEQBmpg8VTv9t026tQoLcF/view?usp=drive_link",
    },
  },
  {
    name: "Fragment D",
    source: {
      uri: "https://drive.google.com/file/d/1iywWDhC_2B7HE82IQHvQ7n4pI_DjJyW2/view?usp=drive_link",
    },
  },
];
const Fragments = () => {
  return (
    <View className="flex-1 bg-odbm-gray-digital justify-start items-center">
      <Text className="text-odbm-gray-light text-xl">fragments</Text>
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
export default Fragments;
