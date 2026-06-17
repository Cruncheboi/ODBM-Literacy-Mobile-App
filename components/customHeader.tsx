import { View } from "react-native";
import CustomBackButton from "@/components/customBackButton";
import Animated, { FadeInRight } from "react-native-reanimated";
import cn from "@/utility_functions/cn";

interface Props {
  title: string;
  children?: React.ReactNode;
  contentContainerClassName?: string;
  showBackButton?: boolean;
}

const CustomHeader = ({
  title,
  children,
  contentContainerClassName,
  showBackButton = true,
}: Props) => {
  const fadeInDelay = 300;

  return (
    <View className="py-safe flex flex-1 items-center justify-start bg-primary">
      <View className="border-borderColor-primary flex-row gap-3 border-b-2 px-2 py-3">
        {showBackButton && (
          <Animated.View entering={FadeInRight.delay(fadeInDelay)}>
            <CustomBackButton />
          </Animated.View>
        )}
        <Animated.Text
          entering={FadeInRight.delay(fadeInDelay)}
          className="flex-1 flex-shrink text-3xl font-bold text-textColor-primary"
        >
          {title}
        </Animated.Text>
      </View>
      <Animated.View
        className={cn(
          "flex w-full flex-1 items-center justify-start gap-4",
          contentContainerClassName,
        )}
        entering={FadeInRight.delay(fadeInDelay)}
      >
        {children}
      </Animated.View>
    </View>
  );
};
export default CustomHeader;
