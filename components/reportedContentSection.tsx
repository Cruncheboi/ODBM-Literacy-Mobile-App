import { Comment, Content, Event, Testimony } from "@/firebaseConfig";
import { Text, View } from "react-native";
import CustomSectionSeparator from "./customSectionSeparator";

interface Props {
  content?: Content | null;
}

const ReportedContentSection = ({ content }: Props) => {
  let contentSection: React.JSX.Element | undefined;
  if (content) {
    const { contentType } = content;
    const postDate = new Date(content.date);
    if (contentType === "testimony" || contentType === "event") {
      const { displayName, title, body } = content as Testimony | Event;
      contentSection = (
        <>
          <View className="flex">
            <View className="flex-1">
              <Text className="text-odbm-gold">@{displayName}</Text>
            </View>
            <Text className="dark:text-gray-300 text-odbm-blue-600">
              {postDate.toLocaleDateString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <Text className="dark:text-gray-200 text-xl font-bold mt-4">
            {title}
          </Text>
          <Text className="dark:text-gray-300 text-lg mb-4 mt-2">{body}</Text>
        </>
      );
    } else {
      const { displayName, body } = content as Comment;
      const postDate = new Date(content.date);
      contentSection = (
        <>
          <View className="flex">
            <View className="flex-1">
              <Text className="text-odbm-gold">@{displayName}</Text>
            </View>
            <Text className="dark:text-gray-300 text-odbm-blue-600">
              {postDate.toLocaleDateString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <Text className="dark:text-gray-300 text-lg mb-4 mt-2">{body}</Text>
        </>
      );
    }
  }
  return (
    <>
      {contentSection}
      <CustomSectionSeparator />
      <View className="mb-2 flex flex-row">
        <View className="flex-1">
          <Text className="dark:text-gray-200 text-xl font-semibold">
            Reports
          </Text>
        </View>
      </View>
    </>
  );
};

export default ReportedContentSection;
