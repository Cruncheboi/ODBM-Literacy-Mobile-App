import { ImageInfo } from "@/definitions/media";
import {
  FlashList,
  FlashListRef,
  ListRenderItemInfo,
} from "@shopify/flash-list";
import StyledImage from "./styledImage";
import {
  BackHandler,
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import {
  GestureTrigger,
  GestureViewer,
  GestureViewerRenderItemInfo,
  useGestureViewerController,
  useGestureViewerState,
} from "react-native-gesture-image-viewer";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CustomBottomSheetBackdrop from "../bottom_sheet/general/backdrop";
import CustomBackground, {
  CustomTransparentBackground,
} from "../customBackground";
import { Galeria } from "@nandorojo/galeria";
import { Gallery, type VerticalPullOptions } from "react-native-zoom-toolkit";
import { scheduleOnRN } from "react-native-worklets";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import LoopingZoomGallery from "./loopingZoomGallery";

interface ImageDisplayProps {
  images: ImageInfo[];
}

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;

const ImageDisplay = ({ images }: ImageDisplayProps) => {
  const { goToIndex } = useGestureViewerController();
  // const { currentIndex, totalCount } = useGestureViewerState();
  const flashListRef = useRef<FlashListRef<string>>(null);
  const imageRef = useRef<Image>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(windowWidth);
  const [imageWidth, setImageWidth] = useState(windowWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [maxGestureHeight, setMaxGestureHeight] = useState(windowWidth);

  const imageUrls = useMemo(() => images.map(({ url }) => url), [images]);
  // const [displayedImage, setDisplayedImage] = useState(imageUrls[0])
  const [curImageIndex, setCurImageIndex] = useState(0);
  console.log(imageUrls);

  // const goToIndex = (targetIndex: number) => {
  //   flashListRef.current?.scrollToIndex({
  //     index: targetIndex,
  //     animated: false,
  //   });
  // };

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!isModalOpen) return;

    const backSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        dismissModal();
        return true; // Prevents React Navigation / Expo Router from popping the route
      },
    );

    return () => backSubscription.remove();
  }, [isModalOpen]);

  // useEffect(() => {}, [imageHeight]);

  const renderImage = (
    item: ImageInfo,
    index: number,
    info: GestureViewerRenderItemInfo,
  ) => {
    return (
      <Image
        className="aspect-square h-full w-full"
        // height={imageHeight}
        // width={imageWidth}
        source={{ uri: item.url }}
        // contentFit="contain"
        // onLoad={({ nativeEvent }) => {
        //   const { height, width } = nativeEvent.source;
        //   const layoutHeight = (height / width) * (windowWidth - 32);
        //   console.log(height, width, layoutHeight, windowWidth);
        //   const { setItemDimensions } = info;
        //   // setItemDimensions({ height: layoutHeight, width: windowWidth - 32 });
        //   // setImageHeight(layoutHeight);
        //   // setImageWidth(windowWidth - 32);
        //   console.log(`height: ${layoutHeight}, width: ${windowWidth - 32}`);
        // }}
      />
    );
  };
  // const renderImage = (
  //   item: ImageInfo,
  //   index: number,
  //   info: GestureViewerRenderItemInfo,
  // ) => {
  //   return <StyledImage url={item.url} itemInfo={info} />;
  // };

  // Bottom sheet
  const snapPoints = useMemo(() => ["100%"], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const sheetIndexRef = useRef<number>(-1);

  const onPickImagesPress = () => {
    if (sheetIndexRef.current < 0) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  };

  // Modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onImagePressed = (index: number) => {
    console.log("image pressed");
    setSelectedIndex(index);
    bottomSheetRef.current?.present();
    console.log(bottomSheetRef.current);
  };

  // const renderItem = useCallback(({}: ListRenderItem<string>) => {
  //   return (
  //     <Image
  //       id={item}
  //       // className="h-full w-full"
  //       style={{ width: 100, height: 100 }}
  //       contentFit="contain"
  //       // resizeMode="contain"
  //       // source={imageUrls[curImageIndex]}
  //       source={{ uri: item }}
  //     />
  //   );
  // }, []);

  const renderImageItem = ({ item }: ListRenderItemInfo<ImageInfo>) => {
    return (
      <Image
        className="aspect-square h-full w-full"
        // height={imageHeight}
        // width={imageWidth}
        source={{ uri: item.url }}
        resizeMode="contain"
        // onLoad={({ nativeEvent }) => {
        //   const { height, width } = nativeEvent.source;
        //   const layoutHeight = (height / width) * (windowWidth - 32);
        //   console.log(height, width, layoutHeight, windowWidth);
        //   const { setItemDimensions } = info;
        //   // setItemDimensions({ height: layoutHeight, width: windowWidth - 32 });
        //   // setImageHeight(layoutHeight);
        //   // setImageWidth(windowWidth - 32);
        //   console.log(`height: ${layoutHeight}, width: ${windowWidth - 32}`);
        // }}
      />
    );
  };
  const backdropOpacity = useSharedValue(1);

  const dismissModal = useCallback(() => {
    bottomSheetRef.current?.forceClose();
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: `rgba(0, 0, 0, ${backdropOpacity.value})`,
  }));

  const handleVerticalPull = useCallback(
    ({ translateY, released, velocityY }: VerticalPullOptions) => {
      "worklet";

      // Optional: fade the modal background smoothly as the user pulls vertically
      const progress = Math.min(Math.abs(translateY) / 250, 1);
      backdropOpacity.value = 1 - progress;

      if (released) {
        const shouldDismiss =
          Math.abs(translateY) > DISMISS_DISTANCE ||
          Math.abs(velocityY ?? 0) > DISMISS_VELOCITY;

        if (shouldDismiss) {
          scheduleOnRN(dismissModal);
          // scheduleOnRN(() => goToIndex(selectedIndex));
        } else {
          backdropOpacity.value = 1;
        }
      }
    },
    [backdropOpacity, dismissModal],
  );

  return (
    // <View className="w-full border border-borderColor-primary">
    <>
      <View
        className="w-full"
        onLayout={(e) => {
          if (e.nativeEvent.layout.width !== imageWidth)
            setImageWidth(e.nativeEvent.layout.width);
        }}
      >
        <View className="overflow-hidden rounded-lg border border-borderColor-primary">
          <GestureViewer
            data={imageUrls}
            width={imageWidth}
            height={imageHeight}
            enableLoop
            enableDoubleTapZoom={false}
            enablePanWhenZoomed={false}
            enablePinchZoom={false}
            initialIndex={selectedIndex}
            dismiss={{ enabled: false }}
            pageSpacing={16}
            onSingleTap={({ index }) => onImagePressed(index)}
            renderItem={(item, index) => {
              return (
                // <GestureTrigger
                //   id="modalViewer"
                //   index={index}
                //   // onPress={() => onImagePressed(index)}
                // >
                // <Pressable onPress={() => onImagePressed(index)}>
                <Image
                  className=""
                  // id={item}
                  style={{ width: imageWidth, height: imageHeight }}
                  contentFit="cover"
                  source={{ uri: item }}
                />
                // </Pressable>
                // </GestureTrigger>
              );
            }}
          />
        </View>
        {/* <Modal visible={isModalVisible} transparent animationType="fade">
          <GestureViewer
            id="modalViewer"
            data={imageUrls}
            initialIndex={selectedIndex}
            enableLoop
            enablePanWhenZoomed
            enableDoubleTapZoom
            enablePinchZoom
            maxZoomScale={3}
            width={windowWidth}
            height={windowHeight}
            renderItem={(item, index, info) => {
              return (
                <Image
                  // className="w-full"
                  // id={item}
                  style={{ height: windowHeight, width: windowWidth }}
                  contentFit="contain"
                  source={{ uri: item }}
                  onLoad={(e) => {
                    const { height, width } = e.source;
                    // info.setItemDimensions({ height, width });
                  }}
                />
              );
            }}
            onDismiss={() => {
              // bottomSheetRef.current?.dismiss();
              setIsModalVisible(false);
            }}
          />
        </Modal> */}
        {/* <Gallery
          data={imageUrls}
          renderItem={(item, index) => {
            return (
              <Image
                // className="w-full"
                // id={item}
                style={{ height: windowHeight, width: windowWidth }}
                contentFit="contain"
                source={{ uri: item }}
                onLoad={(e) => {
                  const { height, width } = e.source;
                  // info.setItemDimensions({ height, width });
                }}
              />
            );
          }}
        /> */}
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
          onDismiss={dismissModal}
          onChange={(index) => setIsModalOpen(index >= 0)}
        >
          <BottomSheetView className="h-full w-full">
            {/* <GestureViewer
              id="modalViewer"
              data={imageUrls}
              initialIndex={selectedIndex}
              enableLoop
              enablePanWhenZoomed
              enableDoubleTapZoom
              enablePinchZoom
              maxZoomScale={3}
              width={windowWidth}
              height={windowHeight}
              renderItem={(item, index, info) => {
                return (
                  <Image
                    // className="w-full"
                    // id={item}
                    style={{ height: windowHeight, width: windowWidth }}
                    contentFit="contain"
                    source={{ uri: item }}
                    onLoad={(e) => {
                      const { height, width } = e.source;
                      // info.setItemDimensions({ height, width });
                    }}
                  />
                );
              }}
              onDismiss={() => bottomSheetRef.current?.dismiss()}
            /> */}
            <Animated.View style={containerAnimatedStyle}>
              <LoopingZoomGallery
                imageUrls={imageUrls}
                handleVerticalPull={handleVerticalPull}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                renderItem={(item, index) => {
                  return (
                    <Image
                      style={{ height: windowHeight, width: windowWidth }}
                      contentFit="contain"
                      source={{ uri: item }}
                    />
                  );
                }}
              />
              {/* <Gallery
                onVerticalPull={handleVerticalPull}
                pinchMode="free"
                allowPinchPanning
                data={imageUrls}
                onIndexChange={(index) => {
                  setSelectedIndex(index);
                }}
                initialIndex={selectedIndex}
                renderItem={(item, index) => {
                  return (
                    <Image
                      // className="w-full"
                      // id={item}
                      style={{ height: windowHeight, width: windowWidth }}
                      contentFit="contain"
                      source={{ uri: item }}
                      onLoad={(e) => {
                        const { height, width } = e.source;
                        // info.setItemDimensions({ height, width });
                      }}
                    />
                  );
                }}
              /> */}
            </Animated.View>
          </BottomSheetView>
        </BottomSheetModal>
        {/* <Galeria urls={imageUrls} theme="dark">
          <FlashList
            ref={flashListRef}
            data={imageUrls}
            className="w-full rounded-lg border border-borderColor-primary"
            horizontal
            pagingEnabled
            renderItem={({ item, index }) => {
              return (
                <Galeria.Image
                  index={index}
                  key={item}
                  // onDismiss={(e) => {
                  //   console.log("going to index:", index);
                  //   goToIndex(index);
                  // }}
                  onIndexChange={(e) => {
                    console.log("indexed changed", e.nativeEvent.currentIndex);
                    goToIndex(e.nativeEvent.currentIndex);
                  }}
                >
                  <Image
                    className=""
                    // id={item}
                    style={{ width: imageWidth, height: imageHeight }}
                    contentFit="cover"
                    source={{ uri: item }}
                    transition={3000}
                  />
                </Galeria.Image>
              );
            }}
          />
        </Galeria> */}
      </View>
      {/* <FlashList
        className=""
        data={images}
        renderItem={renderImageItem}
        horizontal
        // horizontal
        // pagingEnabled={true}
      /> */}
      {/* <Image
        height={imageHeight}
        width={imageWidth}
        className="bg-white"
        source={{ uri: images[0]?.url }}
        resizeMode="contain"
        onLoad={({ nativeEvent }) => {
          const { height, width } = nativeEvent.source;
          const layoutHeight = (height / width) * windowWidth;
          
          setImageHeight(layoutHeight);
          setImageWidth(windowWidth);
          console.log(`height: ${layoutHeight}, width: ${windowWidth}`);
        }}
      /> */}
      {/* <View className="bg-pop">
        <GestureViewer
          containerStyle={{
            // alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor: "transparent",
            display: "flex",
            borderWidth: 3,
            borderColor: "red",
            // height: imageHeight,
            backgroundColor: "pink",
            maxWidth: 200,
            maxHeight: 384,
          }}
          backdropStyle={{
            backgroundColor: "white",
            // height: imageHeight,
            // height: 400,
            // width: "100%",
          }}
          data={images}
          // height={imageHeight}
          // width={imageWidth}
          renderItem={renderImage}
          enablePinchZoom={false}
          enablePanWhenZoomed={false}
          enableDoubleTapZoom={false}
          pageSpacing={16}
          enableLoop
          dismiss={{
            enabled: false,
          }}
          // onDismiss={() => setVisible(false)}
        />
      </View> */}
    </>
    /* {images.map((val) => (
        <Image
          key={val.id}
          className="h-full w-full flex-1 self-center bg-transparent"
          source={{ uri: val.url }}
          resizeMode="contain"
        />
      ))} */
    /* <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backdropComponent={CustomBottomSheetBackdrop}
        backgroundComponent={CustomBackground}
        enableOverDrag={true}
        enableDynamicSizing={false}
      >
        <GestureViewer
          data={images}
          initialIndex={selectedIndex}
          renderItem={renderImage}
          onDismiss={() => setVisible(false)}
        />
        <View>
          <Button title="Prev" onPress={goToPrevious} />
          <Button title="Jump to index 2" onPress={() => goToIndex(2)} />
          <Button title="Next" onPress={goToNext} />
          <Text>{`${currentIndex + 1} / ${totalCount}`}</Text>
        </View>
      </BottomSheetModal> */
    // </View>
    // <View className="">
    //   <GestureViewer data={images}  />
    /* <FlashList
        contentContainerClassName="h-[21.5rem]"
        className="w-full rounded-lg border-2 border-borderColor-primary bg-bgColor-spotlight"
        horizontal
        data={images}
        renderItem={renderListItem}
      /> */
    // </View>
  );
};
export default ImageDisplay;
