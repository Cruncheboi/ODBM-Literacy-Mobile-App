import { Comment } from "@/firebaseConfig";
import { View, Text } from "react-native";

interface Props {
  comment: Comment;
}

const CommentCard = ({ comment }: Props) => {
  const date = new Date(comment.date);

  return (
    <View className="flex w-full border p-2 rounded-2xl border-gray-400 bg-odbm-gray-light dark:bg-odbm-gray-digital-dark">
      <View className="flex flex-row">
        <Text className="text-odbm-blue-300 dark:text-odbm-gold flex-1">
          @{comment.displayName}
        </Text>
        <Text className="dark:text-gray-300 text-odbm-blue-600">
          {date.toLocaleDateString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <Text className="text-odbm-blue-500 dark:text-gray-300">
        {comment.body}
      </Text>
    </View>
  );
};
export default CommentCard;
