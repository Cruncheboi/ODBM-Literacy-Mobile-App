import Pdf from "@/components/pdf";
import { useLocalSearchParams } from "expo-router";
const Vocab = () => {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  console.log(uri);

  return <Pdf source={{ uri: uri }}></Pdf>;
};
export default Vocab;
