import CustomOpacityButton from "@/components/customOpacityButton";
import { router } from "expo-router";
import { View, Text, ScrollView } from "react-native";

const sources = [
  {
    name: "1",
    source: {
      uri: "https://drive.google.com/file/d/1ctxQ_iGA2N7WVQhzIcxugsTIFTPwXRSw/view?usp=drive_link",
    },
  },
  {
    name: "2",
    source: {
      uri: "https://drive.google.com/file/d/1OolCwcgwQ6VzRSkT4SUk7VJtbT_5CSnO/view?usp=drive_link",
    },
  },
  {
    name: "3",
    source: {
      uri: "https://drive.google.com/file/d/1WeHZNQxvvQTksP30QL8bTZlATir106Mz/view?usp=drive_link",
    },
  },
  {
    name: "4",
    source: {
      uri: "https://drive.google.com/file/d/10eY9-MWfibuGSY_V6MQtIsX35wPKZTwr/view?usp=drive_link",
    },
  },
  {
    name: "5",
    source: {
      uri: "https://drive.google.com/file/d/1c7TFcLScfe-6lVoSZ2aK4oI2rPJv87WA/view?usp=drive_link",
    },
  },
  {
    name: "6",
    source: {
      uri: "https://drive.google.com/file/d/1Qaefkciuainq6rdMqXglcP7iUN6NYsal/view?usp=drive_link",
    },
  },
  {
    name: "7",
    source: {
      uri: "https://drive.google.com/file/d/1h4HxT_Gt16QNBeEZ3eIWdWgzDyWHK3pY/view?usp=drive_link",
    },
  },
  {
    name: "8",
    source: {
      uri: "https://drive.google.com/file/d/1QHfyLNRaHEna-xvPEEzGGZSB3vHl31Yf/view?usp=drive_link",
    },
  },
  {
    name: "9",
    source: {
      uri: "https://drive.google.com/file/d/1JQSmJoPlGdeciqIcykcbtILYfiNDH3dO/view?usp=drive_link",
    },
  },
];
const Fragments = () => {
  return (
    <ScrollView
      className="flex-1 bg-odbm-gray-digital"
      contentContainerClassName="justify-start items-center"
    >
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
    </ScrollView>
  );
};
export default Fragments;
