import { Comment } from "@/firebaseConfig";
import { View, Text } from "react-native";

interface Props {
  comment: Comment;
}

const CommentCard = ({ comment }: Props) => {
  const date = new Date(comment.date);

  return (
    <View className="bg-bgColor-primary flex w-full rounded-2xl border border-gray-400 p-2">
      <View className="flex flex-row">
        <Text className="flex-1 text-highlight">@{comment.displayName}</Text>
        <Text className="text-textColor-body">
          {date.toLocaleDateString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <Text className="text-textColor-body">{comment.body}</Text>
    </View>
  );
};
export default CommentCard;
