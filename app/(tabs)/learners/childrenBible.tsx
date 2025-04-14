import CustomOpacityButton from "@/components/customOpacityButton";
import Pdf from "@/components/pdf";
import { router } from "expo-router";
import { View, Text } from "react-native";
const source = {
  uri: "https://drive.google.com/file/d/1IgkidJ3ug58aeYmCpcHmwcMja0OdD0fW/view?usp=sharing",
};
const ChildrenBible = () => {
  return <Pdf source={source} />;
};
export default ChildrenBible;
