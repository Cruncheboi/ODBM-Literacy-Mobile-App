import CustomNavigationDropdown, {
  NavigationDropdownItem,
} from "@/components/customNavigationDropdown";
import CustomOpacityButton from "@/components/customOpacityButton";
import CustomSectionHeader from "@/components/customSectionHeader";
import CustomSectionItem from "@/components/customSectionItem";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import { Href, router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { SectionList, SectionListData, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type SectionItem = { title: string; route?: Href };
type SectionData = { sectionName: string };

type Section = SectionListData<SectionItem, SectionData>;
const Index = () => {
  const sectionListRef = useRef<SectionList<SectionItem, SectionData>>(null);

  // Drop down navigation
  const navigationItems = useMemo(() => {
    return sections.map<NavigationDropdownItem>(({ sectionName }, index) => {
      return {
        title: sectionName,
        onTap: () => {
          if (sectionListRef.current != null) {
            sectionListRef.current.scrollToLocation({
              sectionIndex: index,
              itemIndex: 0,
              viewOffset: 0,
            });
          }
        },
      };
    });
  }, [sections]);

  const onScrollFail = (info: any) => {
    console.log("Failed to scroll, retrying", info);
    setTimeout(() => {
      sectionListRef.current?.scrollToLocation({
        sectionIndex: info.index,
        itemIndex: 0,
      });
    }, 500);
  };
  return (
    <View className="flex-1 py-safe flex justify-start items-center dark:bg-odbm-gray-digital">
      <CustomNavigationDropdown
        title="For Facilitators"
        data={navigationItems}
      />
      <SectionList
        ref={sectionListRef}
        className="w-full"
        contentContainerClassName="px-5 pb-5"
        sections={sections}
        onScrollToIndexFailed={onScrollFail}
        renderSectionHeader={({ section }) => {
          return <CustomSectionHeader title={section.sectionName} />;
        }}
        ItemSeparatorComponent={() => {
          return <CustomSectionSeparator />;
        }}
        renderSectionFooter={() => {
          return <View className="py-1" />;
        }}
        renderItem={({ item }) => {
          return (
            <CustomSectionItem
              title={item.title}
              onPress={() => {
                if (item.route != undefined) {
                  router.push(item.route);
                }
              }}
            />
          );
        }}
      />
    </View>
  );
};
export default Index;

const sections: Section[] = [
  {
    sectionName: "Program Overview",
    data: [
      {
        title: "View video",
        route: "/(tabs)/facilitators/aboutProgramOverview",
      },
    ],
  },
  {
    sectionName: "Acquisition Order and Time",
    data: [
      {
        title: "View video",
        route: "/(tabs)/facilitators/aboutAcquisition",
      },
    ],
  },
  {
    sectionName: "What is Assessment?",
    data: [
      {
        title: "View video",
        route: "/(tabs)/facilitators/aboutAssessment",
      },
    ],
  },
  {
    sectionName: "Let's Learn About SUN",
    data: [
      {
        title: "View video",
        route: "/(tabs)/facilitators/aboutSun",
      },
    ],
  },
  {
    sectionName: "What is the Literacy Kit and How to Use It?",
    data: [
      {
        title: "View video",
        route: "/(tabs)/facilitators/aboutLiteracyKit",
      },
    ],
  },
  {
    sectionName: "The Supplemental Library and Its Purpose",
    data: [
      {
        title: "View video",
        route: "/(tabs)/facilitators/aboutSupplementalLibrary",
      },
    ],
  },
  {
    sectionName: "Church Implementation",
    data: [
      {
        title: "View video",
        route: "/(tabs)/facilitators/aboutChurchImplementation",
      },
    ],
  },
];
