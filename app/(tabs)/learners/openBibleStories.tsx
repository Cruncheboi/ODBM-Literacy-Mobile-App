import CustomOpacityButton from "@/components/customOpacityButton";
import { router } from "expo-router";
import { useEffect } from "react";
import { View, Text } from "react-native";
import PdfViewer from "./(pdfs)/pdfViewer";
import Pdf from "@/components/pdf";
const source = {
  uri: "https://drive.google.com/file/d/1IgkidJ3ug58aeYmCpcHmwcMja0OdD0fW/view?usp=sharing",
};
const OpenBibleStories = () => {
  // useEffect(() => {
  //   router.push({
  //     pathname: "/(tabs)/learners/(pdfs)/pdfViewer",
  //     params: sources[0].source,
  //   });
  // }, []);

  // return (
  //   <View className="flex-1 bg-odbm-gray-digital justify-start items-center">
  //     <Text className="text-odbm-gray-light text-xl">fragments</Text>
  //     {sources.map(({ name, source }) => {
  //       return (
  //         <CustomOpacityButton
  //           key={name}
  //           title={name}
  //           onPress={() =>
  //             router.push({
  //               pathname: "/(tabs)/learners/(pdfs)/pdfViewer",
  //               params: source,
  //             })
  //           }
  //         />
  //       );
  //     })}
  //   </View>
  // );
  return <Pdf source={source} />;
};
export default OpenBibleStories;
