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
        title="For Facillitators"
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
        title: "Program Overview",
        route: "/(tabs)/facillitators/aboutProgramOverview",
      },
    ],
  },
  {
    sectionName: "Acquisition Order and Time",
    data: [
      {
        title: "Acquisition Order and Time",
        route: "/(tabs)/facillitators/aboutAcquisition",
      },
    ],
  },
  {
    sectionName: "What is Assessment?",
    data: [
      {
        title: "What is Assessment?",
        route: "/(tabs)/facillitators/aboutAssessment",
      },
    ],
  },
  {
    sectionName: "Let's Learn About SUN",
    data: [
      {
        title: "Let's Learn About SUN",
        route: "/(tabs)/facillitators/aboutSun",
      },
    ],
  },
  {
    sectionName: "What is the Literacy Kit and How to Use It?",
    data: [
      {
        title: "What is the Literacy Kit and How to Use It?",
        route: "/(tabs)/facillitators/aboutLiteracyKit",
      },
    ],
  },
  {
    sectionName: "The Supplemental Library and Its Purpose",
    data: [
      {
        title: "The Supplemental Library and Its Purpose",
        route: "/(tabs)/facillitators/aboutSupplementalLibrary",
      },
    ],
  },
  {
    sectionName: "Church Implementation",
    data: [
      {
        title: "Church Implementation",
        route: "/(tabs)/facillitators/aboutChurchImplementation",
      },
    ],
  },
];
