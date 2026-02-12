import { View, Text } from "react-native";
const ListFilter = () => {
  return (
    <View className="my-4 px-4 border-2 w-5/12 h-14 rounded-full border-odbm-blue-600 dark:border-slate-700 bg-odbm-gray flex">
      <View className="flex-1 flex-row">
        <View className="flex-1 items-center justify-center">
          <Text>Sort By: ASC</Text>
        </View>
        <View className="flex-1">
          <Text>Yo</Text>
        </View>
      </View>
    </View>
  );
};
export default ListFilter;
