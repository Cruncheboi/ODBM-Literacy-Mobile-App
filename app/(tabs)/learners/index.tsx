import { View, SectionList, SectionListData } from "react-native";
import { Href, router } from "expo-router";
import CustomSectionItem from "@/components/customSectionItem";
import CustomNavigationDropdown, {
  NavigationDropdownItem,
} from "@/components/customNavigationDropdown";
import { useMemo, useRef } from "react";
import CustomSectionSeparator from "@/components/customSectionSeparator";
import CustomSectionHeader from "@/components/customSectionHeader";

type SectionItem = { title: string; pdfSource?: { uri: string }; route?: Href };
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
    <View className="flex-1 bg-odbm-light dark:bg-odbm-gray-digital flex justify-start items-center py-safe">
      <CustomNavigationDropdown title="For Learners" data={navigationItems} />
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
                // Displays PDF item
                if (item.pdfSource != undefined) {
                  router.push({
                    pathname: "/(tabs)/learners/(pdfs)/pdfViewer",
                    params: item.pdfSource,
                  });
                }
                // Redirects to route
                else if (item.route != undefined) {
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
    sectionName: "Assessment",
    data: [
      {
        title: "Take placement assessment",
        route: "/(tabs)/learners/assessment",
      },
    ],
  },
  {
    sectionName: "Vocabulary",
    data: [
      {
        title: "Vocab A",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1JTSBP7gx3Vk1UvMJc7-mDOxPmQKkVwmI/view?usp=drive_link",
        },
      },
      {
        title: "Vocab B",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1jez4iBC_oOHxa2YsPW-NQZS1AX8xyFJa/view?usp=drive_link",
        },
      },
      {
        title: "Vocab C",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1h-v_n_KtswBOJw-DIl8H6WfPjD9c2p5V/view?usp=drive_link",
        },
      },
      {
        title: "Vocab D",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1ANcaZlX_gBcovGBWwVAZGEAWWrsjyCf4/view?usp=drive_link",
        },
      },
    ],
  },
  {
    sectionName: "Fragments",
    data: [
      {
        title: "Fragment A",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1n6Bc4mLVr74S0dBUL5OSjj4yoBXoFqnC/view?usp=drive_link",
        },
      },
      {
        title: "Fragment B",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1dpPM795GrhECXldzlImPWYQgj73_ht6W/view?usp=drive_link",
        },
      },
      {
        title: "Fragment C",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1aqCoVfwe5cIEQBmpg8VTv9t026tQoLcF/view?usp=drive_link",
        },
      },
      {
        title: "Fragment D",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1iywWDhC_2B7HE82IQHvQ7n4pI_DjJyW2/view?usp=drive_link",
        },
      },
    ],
  },
  {
    sectionName: "Sentences",
    data: [
      {
        title: "Easy Sentences",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1ynygpcgliovkn_kxf3x7Hb1WBsPRsfaW/view?usp=drive_link",
        },
      },
      {
        title: "Medium Sentences A",
        pdfSource: {
          uri: "https://drive.google.com/file/d/16I28AGhdI1ZiiDd40hz0x4lTC_1ZoKsv/view?usp=drive_link",
        },
      },
      {
        title: "Medium Sentences B",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1M_T3PZz3nFwPX5TSGHDR92YQsr5KQD9b/view?usp=drive_link",
        },
      },
      {
        title: "Hard Sentences",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1sGUGMJ-HqiitC0PQA9XF1AklwSRphuFi/view?usp=drive_link",
        },
      },
    ],
  },
  {
    sectionName: "Open Bible Stories",
    data: [
      {
        title: "Read Open Bible Stories",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1IgkidJ3ug58aeYmCpcHmwcMja0OdD0fW/view?usp=sharing",
        },
      },
    ],
  },
  {
    sectionName: "Devotionals",
    data: [
      {
        title: "Part 1",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1ctxQ_iGA2N7WVQhzIcxugsTIFTPwXRSw/view?usp=drive_link",
        },
      },
      {
        title: "Part 2",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1OolCwcgwQ6VzRSkT4SUk7VJtbT_5CSnO/view?usp=drive_link",
        },
      },
      {
        title: "Part 3",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1WeHZNQxvvQTksP30QL8bTZlATir106Mz/view?usp=drive_link",
        },
      },
      {
        title: "Part 4",
        pdfSource: {
          uri: "https://drive.google.com/file/d/10eY9-MWfibuGSY_V6MQtIsX35wPKZTwr/view?usp=drive_link",
        },
      },
      {
        title: "Part 5",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1c7TFcLScfe-6lVoSZ2aK4oI2rPJv87WA/view?usp=drive_link",
        },
      },
      {
        title: "Part 6",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1Qaefkciuainq6rdMqXglcP7iUN6NYsal/view?usp=drive_link",
        },
      },
      {
        title: "Part 7",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1h4HxT_Gt16QNBeEZ3eIWdWgzDyWHK3pY/view?usp=drive_link",
        },
      },
      {
        title: "Part 8",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1QHfyLNRaHEna-xvPEEzGGZSB3vHl31Yf/view?usp=drive_link",
        },
      },
      {
        title: "Part 9",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1JQSmJoPlGdeciqIcykcbtILYfiNDH3dO/view?usp=drive_link",
        },
      },
    ],
  },
  {
    sectionName: "Children's Bible",
    data: [
      {
        title: "Read children's Bible",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1IgkidJ3ug58aeYmCpcHmwcMja0OdD0fW/view?usp=sharing",
        },
      },
    ],
  },
  {
    sectionName: "Bible",
    data: [
      {
        title: "Read Bible",
        pdfSource: {
          uri: "https://drive.google.com/file/d/1_bH5L7jxnzieZlZjuveyrO0ZaMPNRDSV/view?usp=sharing",
        },
      },
    ],
  },
];
