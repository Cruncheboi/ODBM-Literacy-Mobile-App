import { Comment, Content, Event, Testimony } from "@/firebaseConfig";
import { Text, View } from "react-native";
import CustomSectionSeparator from "./customSectionSeparator";
import StyledButton from "./styledButton";
import StyledLabel from "./styledLabel";
import { useCallback } from "react";
import { router } from "expo-router";
import { ViewPostSearchParams } from "@/app/postActions/viewPost";

interface Props {
  content?: Content | null;
}

const ReportedContentSection = ({ content }: Props) => {
  let contentSection: React.JSX.Element | undefined;
  if (content) {
    const { contentType, body } = content;
    const postDate = new Date(content.date);
    // Display a testimony or event report
    if (contentType === "testimony" || contentType === "event") {
      const { displayName, title } = content as Testimony | Event;
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
      // Display a comment report
    } else {
      const { displayName, postID, contentType, postType } = content as Comment;
      const postDate = new Date(content.date);

      const linkToParentPost = useCallback(
        () => (
          <StyledButton
            label={<StyledLabel label="View parent post" />}
            onPress={() => {
              router.push({
                pathname: "/postActions/viewPost",
                params: {
                  postID,
                  postType,
                } as ViewPostSearchParams,
              });
            }}
          />
        ),
        [content],
      );

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
          {linkToParentPost()}
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
