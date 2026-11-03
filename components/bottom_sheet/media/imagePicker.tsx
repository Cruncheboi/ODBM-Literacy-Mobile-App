import StyledButton from "@/components/styledButton";
import StyledLabel from "@/components/styledLabel";
import { CompressedImagePayload, MAX_PHOTOS_LIMIT } from "@/definitions/media";
import {
  fetchCameraRollImagesInfo,
  LocalAssetRecord,
} from "@/utility_functions/images/mediaLoader";
import {
  BottomSheetModal,
  useBottomSheetScrollableCreator,
} from "@gorhom/bottom-sheet";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useColorScheme, vars } from "nativewind";
import React, { forwardRef, useMemo, useRef, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollViewProps,
  ActivityIndicator,
} from "react-native";
import CustomBottomSheetBackdrop from "../general/backdrop";
import CustomBackground from "@/components/customBackground";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getThemeHighlightColor } from "@/utility_functions/themeColor";

interface ImagePickerProps {
  selectedImages: CompressedImagePayload[]; // Controlled state tracking active checked IDs
  onToggleAsset: (asset: LocalAssetRecord) => void;
}

const { width } = Dimensions.get("window");
const COLUMN_SIZE = width / 3 - 6; // Perfectly fits 3 items across a responsive row with room for padding

export const ImagePicker = ({
  selectedImages,
  onToggleAsset,
}: ImagePickerProps) => {
  const [gallery, setGallery] = useState<LocalAssetRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const createScrollableComponent = useBottomSheetScrollableCreator();
  const snapPoints = useMemo(() => ["70%"], []);
  const lastAssetId = useRef<string>();
  const { colorScheme } = useColorScheme();

  // Bottom sheet refs
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const sheetIndexRef = useRef<number>(-1);

  const onPickImagesPress = () => {
    if (sheetIndexRef.current < 0) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  };

  const CustomScrollComponent = useMemo(() => {
    return forwardRef<any, ScrollViewProps>((props, ref) => {
      // Create the underlying scroll component base
      const scrollableElement = createScrollableComponent({ ...props, ref });

      // Inject the forwarded ref directly into the element tree
      return scrollableElement;
    });
  }, [createScrollableComponent]);

  async function loadInitialGallery() {
    if (gallery.length !== 0) return;
    setLoading(true);
    const initialImages = await fetchCameraRollImagesInfo();
    lastAssetId.current = initialImages.endCursor;
    setGallery(initialImages.assets);
    setLoading(false);
  }

  const renderItem = ({ item }: ListRenderItemInfo<LocalAssetRecord>) => {
    const selectedIndex = selectedImages.findIndex(
      (val) => val.localAssetId === item.localAssetId,
    );
    const isChecked = selectedIndex !== -1;
    const isCompressing = selectedImages[selectedIndex]?.isCompressing ?? false;

    return (
      <View className="relative aspect-square flex-1 items-center justify-center">
        {isChecked && !isCompressing && (
          <View className="absolute right-2 top-2 z-10 items-center justify-center rounded-lg bg-black/10 px-[1px]">
            <FontAwesome
              name="check"
              size={24}
              color={getThemeHighlightColor(colorScheme)}
            />
          </View>
        )}
        {isChecked && isCompressing && (
          <View className="absolute right-1/2 top-1/2 z-10 -translate-y-1/2 translate-x-1/2">
            <ActivityIndicator
              size="large"
              color={getThemeHighlightColor(colorScheme)}
            />
          </View>
        )}
        <TouchableOpacity
          onPress={() => onToggleAsset(item)}
          activeOpacity={0.8}
        >
          {/* Image Frame */}
          <Image
            style={vars({
              "--column-width": `${COLUMN_SIZE}px`,
            })}
            source={{ uri: item.uri }}
            className={`h-[--column-width] w-[--column-width]`}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handleEndReached = async () => {
    setLoading(true);
    const newImages = await fetchCameraRollImagesInfo(40, lastAssetId.current);
    lastAssetId.current = newImages.endCursor;
    setGallery((prev) => [...prev, ...newImages.assets]);
    setLoading(false);
  };

  const emptyGalleryComponent = () => (
    <View className="flex flex-1 items-center justify-start p-4">
      <StyledLabel label="No images to display." />
      <StyledLabel
        label="Have images? Check allowed permissions for the ODBM Literacy app in device settings."
        className="text-slate-400"
      />
    </View>
  );

  return (
    <>
      <StyledButton
        label={
          <StyledLabel
            label={`Pick Images (${selectedImages.length}/${MAX_PHOTOS_LIMIT})`}
          />
        }
        onPress={() => {
          onPickImagesPress();
          loadInitialGallery();
        }}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backdropComponent={CustomBottomSheetBackdrop}
        backgroundComponent={CustomBackground}
        enableOverDrag={true}
        enableDynamicSizing={false}
      >
        {loading && <ActivityIndicator />}
        {!loading && gallery.length === 0 && emptyGalleryComponent()}
        <FlashList
          numColumns={3}
          data={gallery}
          renderItem={renderItem}
          estimatedItemSize={COLUMN_SIZE}
          renderScrollComponent={CustomScrollComponent}
          extraData={selectedImages}
          onEndReached={handleEndReached}
        />
      </BottomSheetModal>
    </>
  );
};
