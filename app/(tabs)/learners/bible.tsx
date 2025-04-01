import CustomOpacityButton from "@/components/customOpacityButton";
import { router } from "expo-router";
import { View, Text } from "react-native";
const sources = [
  {
    name: "Open Bible",
    source: {
      uri: "https://drive.google.com/file/d/1_bH5L7jxnzieZlZjuveyrO0ZaMPNRDSV/view?usp=sharing",
    },
  },
];
const ChildrenBible = () => {
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
export default ChildrenBible;
