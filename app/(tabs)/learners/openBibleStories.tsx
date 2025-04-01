import CustomOpacityButton from "@/components/customOpacityButton";
import { router } from "expo-router";
import { View, Text } from "react-native";
const sources = [
  {
    name: "Stories",
    source: {
      uri: "https://drive.google.com/file/d/1IgkidJ3ug58aeYmCpcHmwcMja0OdD0fW/view?usp=sharing",
    },
  },
];
const OpenBibleStories = () => {
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
export default OpenBibleStories;
