// FLASHLIST COMPONENTS

import { Text, View } from "react-native";

// Retrieves component to display when there are no posts to show
export const showItemOnEmptyList = () => {
  return (
    <View>
      <Text className="text-center text-xl dark:text-gray-300">
        Hmm... Looks like there are no items yet.
      </Text>
    </View>
  );
};

// Retrieves component to display when there was an error retrieving posts
export const showItemOnError = () => {
  return (
    <View>
      <Text className="text-center text-xl dark:text-gray-300">
        Hmm... Looks like an error occurred.
      </Text>
    </View>
  );
};

// Returns the component to display on an empty list based on loading and post data state.
export const listEmptyComponent = (isFetching: boolean, data: any) => {
  if (isFetching) {
    return null;
  }

  if (data == undefined) {
    return showItemOnError();
  }
  return showItemOnEmptyList();
};
