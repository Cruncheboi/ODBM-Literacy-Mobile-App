import Pdf from "@/components/pdf";
import { Props } from "@/components/pdf";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";

type SearchParams = {
  uri: string;
};

const PdfViewer = () => {
  const { uri } = useLocalSearchParams<SearchParams>();

  console.log(uri);

  return <Pdf source={{ uri: uri }}></Pdf>;
};
export default PdfViewer;
