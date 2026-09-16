import { View } from "react-native";
import StyledButton from "../styledButton";
import StyledLabel from "../styledLabel";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getThemeFontColor } from "@/utility_functions/themeColor";
import { useColorScheme } from "nativewind";

interface DeleteOptionsParams {
  showDeleteConfirmation: boolean;
  setShowDeleteConfirmation: (isShown: boolean) => void;
  onDelete: () => Promise<void>;
}

const DeleteOptionButton = ({
  showDeleteConfirmation,
  setShowDeleteConfirmation,
  onDelete,
}: DeleteOptionsParams) => {
  const { colorScheme } = useColorScheme();
  if (showDeleteConfirmation) {
    return (
      <>
        <StyledButton
          className="bg-red-700"
          label={<StyledLabel label="Confirm Deletion" />}
          onPress={async () => {
            await onDelete();
            setShowDeleteConfirmation(false);
          }}
        />
        <StyledButton
          label={<StyledLabel label="Go Back" />}
          onPress={() => setShowDeleteConfirmation(false)}
        />
      </>
    );
  }

  return (
    <>
      <StyledButton
        icon={
          <View className="pr-4">
            <MaterialIcons
              name="delete"
              size={24}
              color={getThemeFontColor(colorScheme)}
            />
          </View>
        }
        label={<StyledLabel label="Delete" />}
        onPress={() => setShowDeleteConfirmation(true)}
      />
      <View className="py-2" />
    </>
  );
};
export default DeleteOptionButton;
