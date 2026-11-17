import { ImageInfo } from "@/definitions/media";
import { BackHandler, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import {
  GestureTrigger,
  GestureViewer,
  useGestureViewerController,
  useGestureViewerState,
} from "react-native-gesture-image-viewer";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CustomBottomSheetBackdrop from "../bottom_sheet/general/backdrop";
import { CustomTransparentBackground } from "../customBackground";
import { Gallery, type VerticalPullOptions } from "react-native-zoom-toolkit";
import { scheduleOnRN } from "react-native-worklets";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import LoopingZoomGallery from "./loopingZoomGallery";
import { DataSaverImage } from "./DataSaverImage";
import StyledButton from "../styledButton";
import StyledLabel from "../styledLabel";
import { useDataSaverCache } from "@/hooks/useDataSaverCache";
import ImageCounter from "./imageCounter";

interface ImageDisplayProps {
  images: ImageInfo[];
}

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;

const ImageDisplay = ({ images }: ImageDisplayProps) => {
  const { currentIndex } = useGestureViewerState();
  const { currentIndex: currentIndexModalViewer } =
    useGestureViewerState("modalImageViewer");
  const latestModalViewerIndex = useRef(0);
  const { goToIndex } = useGestureViewerController();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [imageWidth, setImageWidth] = useState(windowWidth);
  const imageHeight = windowWidth;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const imageUrls = useMemo(() => images.map(({ url }) => url), [images]);
  const windowSize = 5;

  const { isReady, unlockedKeys, unlockKey } = useDataSaverCache(
    imageUrls,
    true,
  );
  // console.log(unlockedKeys);
  console.log("current modal index", currentIndexModalViewer);
  useEffect(() => {
    if (!isModalOpen) return;
    // Handle returning back to post from modal when user preforms device back navigation
    const backSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        dismissModal();
        return true; // Prevents React Navigation / Expo Router from popping the route
      },
    );

    return () => backSubscription.remove();
  }, [isModalOpen]);

  // BOTTOM SHEET MODAL
  const snapPoints = useMemo(() => ["100%"], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const backdropOpacity = useSharedValue(1);
  const imageCounterOpacity = useSharedValue(1);
  const isModalOpenRef = useRef(false);

  const onImagePressed = (index: number) => {
    setSelectedIndex(index);
    imageCounterOpacity.value = withTiming(1, {
      duration: 1500,
    });
    bottomSheetRef.current?.present();
  };

  if (isModalOpenRef.current) {
    latestModalViewerIndex.current = currentIndexModalViewer;
  }
  const dismissModal = useCallback(() => {
    // goToIndex(currentIndexModalViewer);
    // latestModalViewerIndex.current = currentIndexModalViewer;
    // console.log("setting index to:", latestModalViewerIndex.current);
    // isModalOpenRef.current = false;
    // goToIndex(latestModalViewerIndex.current);
    bottomSheetRef.current?.forceClose();
  }, []);

  const imageCounterAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageCounterOpacity.value,
  }));

  // Fades background
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: `rgba(0, 0, 0, ${backdropOpacity.value})`,
  }));

  const handleVerticalPull = useCallback(
    ({ translateY, released, velocityY }: VerticalPullOptions) => {
      "worklet";

      // Fade the modal background smoothly as the user pulls vertically
      const progress = Math.min(Math.abs(translateY) / 250, 1);
      backdropOpacity.value = 1 - progress;

      const counterProgress = Math.min(Math.abs(translateY) / 100, 1);
      imageCounterOpacity.value = 1 - counterProgress;

      if (released) {
        const shouldDismiss =
          Math.abs(translateY) > DISMISS_DISTANCE ||
          Math.abs(velocityY ?? 0) > DISMISS_VELOCITY;

        if (shouldDismiss) {
          scheduleOnRN(dismissModal);
        } else {
          backdropOpacity.value = 1;
          imageCounterOpacity.value = 1;
        }
      }
    },
    [backdropOpacity, imageCounterOpacity, dismissModal],
  );

  const handleDismissalStart = useCallback(() => {
    "worklet";

    // Fade the modal background
    imageCounterOpacity.value = 0;
  }, [imageCounterOpacity]);

  const handleSheetAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      // toIndex === -1 means the bottom sheet has started closing
      if (toIndex === -1) {
        isModalOpenRef.current = false;
      } else if (toIndex >= 0) {
        isModalOpenRef.current = true;
      }
    },
    [],
  );

  const renderModalContainer = useCallback(
    (children: React.ReactNode) => (
      <View className="relative flex-1">
        {children}
        {
          <Animated.View
            style={imageCounterAnimatedStyle}
            className="pointer-events-none absolute inset-0 z-10 items-center justify-center"
          >
            <ImageCounter
              // selectedIndex={selectedIndex}
              selectedIndex={currentIndexModalViewer}
              totalCount={imageUrls.length}
              className="top-safe-offset-5"
            />
          </Animated.View>
        }
      </View>
    ),
    [currentIndexModalViewer, imageUrls],
  );

  return (
    <>
      <View
        className="w-full"
        onLayout={(e) => {
          if (e.nativeEvent.layout.width !== imageWidth)
            setImageWidth(e.nativeEvent.layout.width);
        }}
      >
        <StyledButton
          label={<StyledLabel label="Reset Image Cache" />}
          onPress={async () => {
            await Image.clearMemoryCache();
            await Image.clearDiskCache();
          }}
        />
        <StyledButton
          label={<StyledLabel label="Log if current image is a cache-hit" />}
          onPress={async () => {
            const imagePath = await Image.getCachePathAsync(
              imageUrls[currentIndex],
            );
            console.log(imagePath);
          }}
        />
        {isReady && (
          <>
            <View className="overflow-hidden rounded-lg border border-borderColor-primary">
              <ImageCounter
                selectedIndex={currentIndex} // use gesture viewer index state
                totalCount={imageUrls.length}
              />
              <GestureViewer
                key={"inlineViewer"}
                data={imageUrls}
                width={imageWidth}
                height={imageHeight}
                enableLoop
                enableDoubleTapZoom={false}
                enablePanWhenZoomed={false}
                enablePinchZoom={false}
                initialIndex={latestModalViewerIndex.current}
                // initialIndex={selectedIndex}
                dismiss={{ enabled: false }}
                windowSize={windowSize}
                pageSpacing={16}
                // horizontalSwipe={{ enabled: true, velocityThreshold: 300 }}
                onSingleTap={({ index }) => onImagePressed(index)}
                renderItem={(item, index) => {
                  return (
                    // <GestureTrigger id="modalImageViewer" index={index}>
                    <DataSaverImage
                      cacheKey={item}
                      isUnlocked={unlockedKeys.has(item)}
                      onUnlock={unlockKey}
                      style={{ width: imageWidth, height: imageHeight }}
                      uri={item}
                      contentFit="cover"
                      // onPress={() => onImagePressed(index)}
                      // containerStyle={{
                      //   width: imageWidth,
                      //   height: imageHeight,
                      //   backgroundColor: "white",
                      // }}
                    />
                    // </GestureTrigger>
                    // <Image
                    //   style={{ width: imageWidth, height: imageHeight }}
                    //   contentFit="cover"
                    //   source={{ uri: item }}
                    // />
                  );
                }}
              />
            </View>
            <BottomSheetModal
              ref={bottomSheetRef}
              snapPoints={snapPoints}
              backdropComponent={CustomBottomSheetBackdrop}
              backgroundComponent={CustomTransparentBackground}
              handleComponent={null}
              enableOverDrag={false}
              enableDynamicSizing={false}
              enablePanDownToClose={false}
              enableContentPanningGesture={false}
              enableHandlePanningGesture={false}
              // onDismiss={dismissModal}
              onAnimate={handleSheetAnimate}
              onChange={(index) => setIsModalOpen(index >= 0)}
            >
              <BottomSheetView className="h-full w-full">
                {/* <Animated.View style={containerAnimatedStyle}> */}
                {/* <View className="relative h-full w-full"> */}
                {/* <Animated.View
                  style={imageCounterAnimatedStyle}
                  className="pointer-events-none absolute inset-0 z-10 items-center justify-center"
                >
                  <ImageCounter
                    // selectedIndex={selectedIndex}
                    selectedIndex={currentIndexModalViewer}
                    totalCount={imageUrls.length}
                    safePadding
                  />
                </Animated.View> */}
                {/* <Gallery
                    onVerticalPull={handleVerticalPull}
                    pinchMode="free"
                    data={imageUrls}
                    initialIndex={selectedIndex}
                    onIndexChange={(curIndex) => setSelectedIndex(curIndex)}
                    windowSize={windowSize}
                    // onTap={(e, index) => unlockKey(imageUrls[index])}
                    onTap={undefined}
                    keyExtractor={(item, index) => `${item}`}
                    renderItem={(item, index) => (
                      <DataSaverImage
                        cacheKey={item}
                        isUnlocked={unlockedKeys.has(item)}
                        onUnlock={(key) => unlockKey(imageUrls[index])}
                        style={{ width: windowWidth, height: windowHeight }}
                        uri={item}
                        contentFit="contain"
                        // containerStyle={{
                        //   width: imageWidth,
                        //   height: imageHeight,
                        //   backgroundColor: "white",
                        // }}
                      />
                    )}
                  /> */}
                {/* </View> */}
                <GestureViewer
                  key={"modalViewer"}
                  id="modalImageViewer"
                  data={imageUrls}
                  width={windowWidth}
                  height={windowHeight}
                  enableLoop
                  initialIndex={currentIndex}
                  dismiss={{ enabled: true, direction: "both" }}
                  onDismiss={dismissModal}
                  onDismissStart={handleDismissalStart}
                  windowSize={windowSize}
                  pageSpacing={16}
                  // onSingleTap={({ index }) => onImagePressed(index)}
                  renderContainer={renderModalContainer}
                  // onDismissStart={handleDismissalStart}
                  renderItem={(item, index) => {
                    return (
                      <DataSaverImage
                        cacheKey={item}
                        isUnlocked={unlockedKeys.has(item)}
                        onUnlock={(key) => unlockKey(imageUrls[index])}
                        style={{ width: windowWidth, height: windowHeight }}
                        uri={item}
                        contentFit="contain"
                        // onPress={() => onImagePressed(index)}
                        // containerStyle={{
                        //   width: imageWidth,
                        //   height: imageHeight,
                        //   backgroundColor: "white",
                        // }}
                      />
                      // <Image
                      //   style={{ width: imageWidth, height: imageHeight }}
                      //   contentFit="cover"
                      //   source={{ uri: item }}
                      // />
                    );
                  }}
                />
                {/* <LoopingZoomGallery
                    imageUrls={imageUrls}
                    handleVerticalPull={handleVerticalPull}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    windowSize={windowSize}
                    onTap={unlockKey}
                    renderItem={(item) => {
                      return (
                        <DataSaverImage
                          cacheKey={item}
                          isUnlocked={unlockedKeys.has(item)}
                          onUnlock={(key) => {}}
                          style={{ width: windowWidth, height: windowHeight }}
                          uri={item}
                          contentFit="contain"
                          // containerStyle={{
                          //   width: imageWidth,
                          //   height: imageHeight,
                          //   backgroundColor: "white",
                          // }}
                        />
                        // <Image
                        //   style={{ height: windowHeight, width: windowWidth }}
                        //   contentFit="contain"
                        //   source={{ uri: item }}
                        // />
                      );
                    }}
                  /> */}
                {/* </Animated.View> */}
              </BottomSheetView>
            </BottomSheetModal>
          </>
        )}
      </View>
    </>
  );
};
export default ImageDisplay;
