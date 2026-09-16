import { CommentPost } from "@/definitions/comments";
import { View, Text } from "react-native";

interface Props {
  comment: CommentPost;
}

const CommentCard = ({ comment }: Props) => {
  const { authorName, body, timestamp } = comment;
  const date = new Date(timestamp);

  return (
    <View className="flex w-full rounded-2xl border border-gray-400 bg-bgColor-primary p-2">
      <View className="flex flex-row">
        <Text className="flex-1 text-highlight">@{authorName}</Text>
        <Text className="text-textColor-body">
          {date.toLocaleDateString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <Text className="text-textColor-body">{body}</Text>
    </View>
  );
};
export default CommentCard;
