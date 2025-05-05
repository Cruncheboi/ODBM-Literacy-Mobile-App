import { View } from "react-native";
import CustomBackButton from "@/components/customBackButton";
import Animated, { FadeInRight } from "react-native-reanimated";
import cn from "@/utility_functions/cn";

interface Props {
  title: string;
  children?: React.ReactNode;
  contentContainerClassName?: string;
}

const CustomHeader = ({
  title,
  children,
  contentContainerClassName,
}: Props) => {
  const fadeInDelay = 300;

  return (
    <View className="flex-1 flex justify-start items-center bg-odbm-light dark:bg-odbm-gray-digital py-safe">
      <View className="flex-row gap-3 px-2 pt-5">
        <Animated.View entering={FadeInRight.delay(fadeInDelay)}>
          <CustomBackButton />
        </Animated.View>
        <Animated.Text
          entering={FadeInRight.delay(fadeInDelay)}
          className="text-3xl font-bold dark:text-white flex-shrink flex-1"
        >
          {title}
        </Animated.Text>
      </View>
      <Animated.View
        className={cn(
          "flex-1 flex items-center w-10/12 gap-4 justify-start",
          contentContainerClassName
        )}
        entering={FadeInRight.delay(fadeInDelay)}
      >
        {children}
      </Animated.View>
    </View>
  );
};
export default CustomHeader;
