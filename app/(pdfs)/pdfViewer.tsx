import Pdf from "@/components/pdf";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

type SearchParams = {
  uri: string;
};

const PdfViewer = () => {
  const { uri } = useLocalSearchParams<SearchParams>();

  console.log(uri);

  return (
    <View className="absolute top-0 left-0 w-full h-full z-10">
      <Pdf source={{ uri: uri }}></Pdf>
    </View>
  );
};
export default PdfViewer;
