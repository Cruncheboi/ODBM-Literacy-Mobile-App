import { ImageInfo } from "@/definitions/media";
import { BackHandler, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import {
  GestureViewer,
  useGestureViewerController,
  useGestureViewerState,
} from "react-native-gesture-image-viewer";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CustomBottomSheetBackdrop from "../bottom_sheet/general/backdrop";
import { CustomTransparentBackground } from "../customBackground";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { DataSaverImage, DataSaverImagePlaceholder } from "./DataSaverImage";
import StyledButton from "../styledButton";
import StyledLabel from "../styledLabel";
import { useDataSaverCache } from "@/hooks/useDataSaverCache";
import ImageCounter from "./imageCounter";
import {
  formatFileSize,
  getContainedDimensions,
} from "@/utility_functions/images/converter";

interface ImageDisplayProps {
  images: ImageInfo[];
}

const ImageDisplay = ({ images }: ImageDisplayProps) => {
  // GESTURE VIEWER
  const { currentIndex } = useGestureViewerState();
  const { currentIndex: currentIndexModalViewer } =
    useGestureViewerState("modalImageViewer");
  const latestModalViewerIndex = useRef(0);
  const windowSize = 5;

  // IMAGE
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [imageWidth, setImageWidth] = useState(windowWidth);
  const imageHeight = windowWidth;
  const imageUrls = useMemo(() => images.map(({ url }) => url), [images]);
  const imageCounterOpacity = useSharedValue(0);
  const { isReady, unlockedKeys, unlockKey } = useDataSaverCache(
    imageUrls,
    true,
  );

  const onImagePressed = (index: number) => {
    imageCounterOpacity.value = withTiming(1, {
      duration: 1500,
    });
    bottomSheetRef.current?.present();
  };

  // Allows fading animation
  const imageCounterAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageCounterOpacity.value,
  }));

  const handleDismissalStart = useCallback(() => {
    "worklet";

    // Fade the counter
    imageCounterOpacity.value = 0;
  }, [imageCounterOpacity]);

  // BOTTOM SHEET MODAL
  const snapPoints = useMemo(() => ["100%"], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isModalOpenRef = useRef(false);

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

  // Track latest index for gesture viewer in modal before it unmounts
  if (isModalOpenRef.current) {
    latestModalViewerIndex.current = currentIndexModalViewer;
  }

  const dismissModal = useCallback(() => {
    bottomSheetRef.current?.forceClose();
  }, []);

  // Track modal close state
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
        <View className="items-center overflow-hidden rounded-lg border border-borderColor-primary">
          {!isReady && (
            <DataSaverImagePlaceholder
              style={{
                width: imageWidth,
                height: imageHeight,
              }}
            />
          )}
          {isReady && (
            <>
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
                dismiss={{ enabled: false }}
                windowSize={windowSize}
                pageSpacing={16}
                onSingleTap={({ index }) => onImagePressed(index)}
                renderItem={(item, index) => {
                  return (
                    <DataSaverImage
                      cacheKey={item}
                      isUnlocked={unlockedKeys.has(item)}
                      onUnlock={unlockKey}
                      style={{
                        width: imageWidth,
                        height: imageHeight,
                      }}
                      uri={item}
                      contentFit="cover"
                      imageHash={images[index].imageHash}
                      fileSizeLabel={formatFileSize(
                        images[index].contentLength,
                      )}
                    />
                  );
                }}
              />
            </>
          )}
        </View>
        {isReady && (
          <>
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
              onAnimate={handleSheetAnimate}
              onChange={(index) => setIsModalOpen(index >= 0)}
            >
              <BottomSheetView className="h-full w-full">
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
                  panInertia={{
                    enabled: true,
                    deceleration: 0.99,
                    rubberBandEffect: true,
                    velocityFactor: 0.6,
                    rubberBandFactor: 3,
                  }}
                  pageSpacing={16}
                  renderContainer={renderModalContainer}
                  renderItem={(item, index) => {
                    return (
                      <DataSaverImage
                        cacheKey={item}
                        isUnlocked={unlockedKeys.has(item)}
                        onUnlock={unlockKey}
                        style={{
                          ...getContainedDimensions(
                            { height: windowHeight, width: windowWidth },
                            {
                              height: images[index].height,
                              width: images[index].width,
                            },
                          ),
                        }}
                        uri={item}
                        contentFit="contain"
                        imageHash={images[index].imageHash}
                        fileSizeLabel={formatFileSize(
                          images[index].contentLength,
                        )}
                      />
                    );
                  }}
                />
              </BottomSheetView>
            </BottomSheetModal>
          </>
        )}
      </View>
    </>
  );
};
export default ImageDisplay;
