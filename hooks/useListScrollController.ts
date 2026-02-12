import { FlashList } from "@shopify/flash-list";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  InteractionManager,
} from "react-native";

interface ReturnListScrollController {
  showScrollToButton: boolean;
  onScrollToPressed: () => void;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  getScrollPosition: () => number;
  setScrollPosition: (YPosition: number) => void;
}

const useListScrollController = (
  flashListRef: MutableRefObject<FlashList<any> | null>,
): ReturnListScrollController => {
  // State
  const [showScrollToButton, setShowScrollToButton] = useState(false);
  const lastScrollPositionRef = useRef<number>(0);
  const onScrollToPressed = () => {
    if (flashListRef.current) {
      flashListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = e.nativeEvent.contentOffset.y;
    if (scrollPosition <= 150) {
      if (showScrollToButton) {
        setShowScrollToButton(false);
      }
    } else {
      if (scrollPosition < lastScrollPositionRef.current) {
        if (!showScrollToButton) {
          setShowScrollToButton(true);
        }
      } else {
        if (showScrollToButton) {
          setShowScrollToButton(false);
        }
      }
    }
    lastScrollPositionRef.current = scrollPosition;
  };

  const getScrollPosition = () => lastScrollPositionRef.current;

  const setScrollPosition = (YPosition: number) => {
    // InteractionManager.runAfterInteractions(() => {
    setTimeout(() => {
      if (flashListRef.current) {
        console.log(`Setting position to ${YPosition}`);
        flashListRef.current.scrollToOffset({
          offset: YPosition,
          animated: false,
        });
      }
    }, 0);
    // });
  };

  // useEffect(() => {}, [scr]);

  return {
    showScrollToButton,
    onScrollToPressed,
    onScroll,
    getScrollPosition,
    setScrollPosition,
  };
};
export default useListScrollController;
