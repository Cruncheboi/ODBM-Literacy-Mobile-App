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
    <View className="absolute left-0 top-0 z-10 h-full w-full">
      <Pdf source={{ uri: uri }}></Pdf>
    </View>
  );
};
export default PdfViewer;
