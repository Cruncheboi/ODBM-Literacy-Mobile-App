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

interface ImageManagerProps {
  images: ImageInfoEditable[];
  setImages: (value: React.SetStateAction<ImageInfoEditable[]>) => void;
  initialImages: ImageInfoEditable[];

  disabled: boolean;
}

const ImageManager = ({
  images,
  setImages,
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

  // Bottom sheet
  const snapPoints = useMemo(() => ["100%"], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteBottomSheetRef = useRef<BottomSheetModal>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;
    // Handle returning back to post from modal when user preforms device back navigation
    const backSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isDeleteModalOpen) {
          deleteBottomSheetRef.current?.dismiss();
        } else {
          bottomSheetRef.current?.dismiss();
        }
        return true; // Prevents popping the route
      },
    );

    return () => backSubscription.remove();
  }, [isModalOpen, isDeleteModalOpen]);

  const handleDeleteImage = () => {
    console.log("deleting image... SIKE");
    deleteBottomSheetRef.current?.dismiss();
  };

  const renderItem = useCallback<SortableGridRenderItem<ImageInfoEditable>>(
    ({ item, index }) => {
      const url = item.isExisting ? item.url : item.uri;

      const showCompressedImage =
        !item.isExisting && item.isCompressing === false;
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
              {showCompressedImage && (
                <StyledImage
                  uri={item.uri}
                  imageHash=""
                  style={sharedStyle}
                  contentFit="cover"
                />
              )}
              {/** Local Image Still Compressing */}
              {showCompressedImage && (
                <DataSaverImagePlaceholder style={sharedStyle} />
              )}
            </View>
          </Galeria.Item>
        </Galeria>
      );
    },
    [unlockedKeys, colorScheme],
  );

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
            <TopBarNavigation />
            <View className="flex-1 bg-bgColor-primary">
              {!isReady && (
                <DataSaverImagePlaceholder
                  className="w-full"
                  style={{
                    height: itemHeight,
                  }}
                />
              )}
              {isReady && (
                <Sortable.Grid
                  columns={2}
                  data={images}
                  renderItem={renderItem}
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
              name="delete-modal"
              onChange={(index) => setIsDeleteModalOpen(index >= 0)}
            >
              <BottomSheetView className="mb-safe flex items-center justify-center gap-4 bg-primary px-4 py-8">
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
              </BottomSheetView>
            </BottomSheetModal>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};
export default ImageManager;
