import { View, Text } from "react-native";

interface PostHeadingProps {
  authorName: string;
  postDate: Date;
}

interface PostTitleProps {
  title: string;
}
interface PostBodyProps {
  body: string;
}

/**
 * Displays the author name, along with the post date
 */
export const StyledPostHeading = ({
  authorName,
  postDate,
}: PostHeadingProps) => {
  return (
    <View className="flex">
      <View className="flex-1">
        <Text className="text-highlight">@{authorName}</Text>
      </View>
      <Text className="text-textColor-title">
        {postDate.toLocaleDateString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
};

export const StyledPostTitle = ({ title }: PostTitleProps) => {
  return (
    <Text className="mt-4 text-xl font-bold text-odbm-blue-600 dark:text-gray-200">
      {title}
    </Text>
  );
};

export const StyledPostBody = ({ body }: PostBodyProps) => {
  return <Text className="mb-4 mt-2 text-lg text-textColor-body">{body}</Text>;
};
