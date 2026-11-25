import { BackHandler, useWindowDimensions, View } from "react-native";
import StyledButton from "../styledButton";
import StyledLabel from "../styledLabel";
import Sortable, { type SortableGridRenderItem } from "react-native-sortables";
import { ImageInfoEditable } from "@/definitions/media";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Galeria } from "@nandorojo/galeria";
import { DataSaverImage, DataSaverImagePlaceholder } from "./DataSaverImage";
import { useDataSaverCache } from "@/hooks/useDataSaverCache";
import StyledImage from "./styledImage";
import { formatFileSize } from "@/utility_functions/images/converter";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CustomBottomSheetBackdrop from "../bottom_sheet/general/backdrop";
import CustomBackground, {
  CustomTransparentBackground,
} from "../bottom_sheet/general/customBackground";
import { TopBarNavigation } from "../bottom_sheet/general/topBarNavigation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getThemeFontColor } from "@/utility_functions/themeColor";
import { useColorScheme } from "nativewind";
import StyledBottomSheetView from "../bottom_sheet/general/styledBottomSheetView";

interface ImageManagerProps {
  images: ImageInfoEditable[];
  setImages: (value: React.SetStateAction<ImageInfoEditable[]>) => void;
  initialImages: ImageInfoEditable[];
  disabled: boolean;
}

const ImageManager = ({
  images,
  setImages,
  initialImages,
  disabled = false,
}: ImageManagerProps) => {
  // Image Data
  const existingImagesInUse = useMemo(
    () => images.filter((image) => image.isExisting),
    [images],
  );
  const existingImagesUrl = useMemo(
    () => existingImagesInUse.map((image) => image.url),
    [existingImagesInUse],
  );
  const { isReady, unlockKey, unlockedKeys } = useDataSaverCache(
    existingImagesUrl,
    true,
  );
  const { height } = useWindowDimensions();
  const itemHeight = height / 3;

  // other state
  const { colorScheme } = useColorScheme();
  const imageIndexToDeleteRef = useRef<number>(-1);

  // Bottom sheet
  const snapPoints = useMemo(() => ["100%"], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteBottomSheetRef = useRef<BottomSheetModal>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const restoreBottomSheetRef = useRef<BottomSheetModal>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;
    // Handle returning back to post from modal when user preforms device back navigation
    const backSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isDeleteModalOpen) {
          deleteBottomSheetRef.current?.dismiss();
        } else if (isRestoreModalOpen) {
          restoreBottomSheetRef.current?.dismiss();
        } else {
          bottomSheetRef.current?.dismiss();
        }
        return true; // Prevents popping the route
      },
    );

    return () => backSubscription.remove();
  }, [isModalOpen, isDeleteModalOpen, isRestoreModalOpen]);

  const handleDeleteImage = () => {
    if (imageIndexToDeleteRef.current >= 0) {
      setImages((prev) => prev.toSpliced(imageIndexToDeleteRef.current, 1));
    }
    deleteBottomSheetRef.current?.dismiss();
  };

  const handleRestorePress = () => {
    setImages(initialImages);
    restoreBottomSheetRef.current?.dismiss();
  };

  const renderItem = useCallback<SortableGridRenderItem<ImageInfoEditable>>(
    ({ item, index }) => {
      const url = item.isExisting ? item.url : item.uri;
      const sharedStyle = { height: itemHeight };

      return (
        <Galeria urls={[url]}>
          <Galeria.Item>
            <View className="relative w-full">
              <View className="absolute left-2 top-2 z-10">
                <View className="rounded-full bg-slate-400/65 px-2 dark:bg-black/65">
                  <StyledLabel
                    label={(index + 1).toString()}
                    className="py-0.5"
                  />
                </View>
              </View>
              <View className="absolute bottom-3 right-3 z-10">
                <View className="rounded-full bg-slate-400/65 px-2 dark:bg-black/65">
                  <MaterialIcons
                    name="delete"
                    size={30}
                    color={getThemeFontColor(colorScheme)}
                    onPress={() => {
                      imageIndexToDeleteRef.current = index;
                      deleteBottomSheetRef.current?.present();
                    }}
                  />
                </View>
              </View>
              {/** Existing Cloud Images */}
              {item.isExisting && (
                <DataSaverImage
                  cacheKey={item.url}
                  uri={item.url}
                  isUnlocked={unlockedKeys.has(item.url)}
                  onUnlock={unlockKey}
                  imageHash={item.imageHash}
                  style={sharedStyle}
                  contentFit="cover"
                  fileSizeLabel={formatFileSize(item.contentLength)}
                />
              )}
              {/** Newly Added Compressed Local Images */}
              {!item.isExisting && !item.isCompressing && (
                <StyledImage
                  uri={item.uri}
                  imageHash=""
                  style={sharedStyle}
                  contentFit="cover"
                />
              )}
              {/** Local Image Still Compressing */}
              {!item.isExisting && item.isCompressing && (
                <DataSaverImagePlaceholder style={sharedStyle} />
              )}
            </View>
          </Galeria.Item>
        </Galeria>
      );
    },
    [unlockedKeys, colorScheme],
  );

  const gridKeyExtractor = (item: ImageInfoEditable) =>
    item.isExisting ? item.url : item.localAssetId;

  return (
    <>
      <StyledButton
        disabled={disabled}
        label={<StyledLabel label="Manage your images" />}
        onPress={() => {
          bottomSheetRef.current?.present();
        }}
      />
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
        onChange={(index) => setIsModalOpen(index >= 0)}
      >
        <BottomSheetView className="py-safe h-full w-full bg-bgColor-primary">
          <BottomSheetScrollView className="px-3" disableScrollViewPanResponder>
            <TopBarNavigation
              onRestorePressed={() => restoreBottomSheetRef.current?.present()}
              disabled={images.length === 0}
            />
            <View className="flex-1 items-center bg-bgColor-primary">
              {images.length === 0 && (
                <StyledLabel label="No images to manage." className="mt-8" />
              )}
              {!isReady && <DataSaverImagePlaceholder className="w-full" />}
              {isReady && (
                <Sortable.Grid
                  columns={2}
                  data={images}
                  renderItem={renderItem}
                  keyExtractor={gridKeyExtractor}
                  columnGap={4}
                  rowGap={4}
                  onDragEnd={(sortedImages) => setImages(sortedImages.data)}
                />
              )}
            </View>
            {/** Delete Button Modal */}
            <BottomSheetModal
              ref={deleteBottomSheetRef}
              backdropComponent={CustomBottomSheetBackdrop}
              backgroundComponent={CustomBackground}
              stackBehavior="push"
              onChange={(index) => setIsDeleteModalOpen(index >= 0)}
            >
              <StyledBottomSheetView>
                <StyledLabel label="This image will be deleted from the post">
                  <StyledLabel label=" ONLY " className="text-highlight" />
                  <StyledLabel label="when you finish updating the post. Do you wish to proceed?" />
                </StyledLabel>
                <StyledButton
                  className="bg-red-700"
                  label={
                    <StyledLabel
                      label="Confirm Deletion"
                      className="text-white"
                    />
                  }
                  onPress={handleDeleteImage}
                />
                <StyledButton
                  label={<StyledLabel label="Go Back" />}
                  onPress={() => deleteBottomSheetRef.current?.close()}
                />
              </StyledBottomSheetView>
            </BottomSheetModal>
            <BottomSheetModal
              ref={restoreBottomSheetRef}
              backdropComponent={CustomBottomSheetBackdrop}
              backgroundComponent={CustomBackground}
              stackBehavior="push"
              onChange={(index) => setIsRestoreModalOpen(index >= 0)}
            >
              <StyledBottomSheetView>
                <StyledLabel label="All changes to images will be reverted. (Including removing newly added photos)" />
                <StyledButton
                  className="bg-red-700"
                  label={
                    <StyledLabel
                      label="Revert Changes"
                      className="text-white"
                    />
                  }
                  onPress={handleRestorePress}
                />
                <StyledButton
                  label={<StyledLabel label="Go Back" />}
                  onPress={() => restoreBottomSheetRef.current?.close()}
                />
              </StyledBottomSheetView>
            </BottomSheetModal>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};
export default ImageManager;
