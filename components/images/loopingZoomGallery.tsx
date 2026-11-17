import React, { useCallback, useMemo, useRef } from "react";
import {
  Gallery,
  VerticalPullOptions,
  type GalleryRefType,
} from "react-native-zoom-toolkit";

interface LoopingZoomGalleryProps {
  imageUrls: string[];
  selectedIndex: number;
  windowSize?: number;
  renderItem: (
    item: string,
    index: number,
  ) => React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
  setSelectedIndex: (value: React.SetStateAction<number>) => void;
  handleVerticalPull: ({
    translateY,
    released,
    velocityY,
  }: VerticalPullOptions) => void;
  onTap?: (cacheKey: string) => void;
}

export const LoopingZoomGallery = ({
  imageUrls,
  selectedIndex,
  windowSize = 5,
  renderItem,
  setSelectedIndex,
  handleVerticalPull,
  onTap,
}: LoopingZoomGalleryProps) => {
  const galleryRef = useRef<GalleryRefType>(null);
  const canLoop = imageUrls.length > 1;

  const loopedData = useMemo(() => {
    if (!canLoop) return imageUrls;
    return [imageUrls[imageUrls.length - 1], ...imageUrls, imageUrls[0]];
  }, [imageUrls, canLoop]);

  const loopToNormalIndex = (currentIndex: number) =>
    (currentIndex - 1 + imageUrls.length) % imageUrls.length;

  const handleIndexChange = useCallback(
    (index: number) => {
      setSelectedIndex(loopToNormalIndex(index));
      if (!canLoop) return;

      if (index === 0) {
        setTimeout(() => {
          galleryRef.current?.setIndex(imageUrls.length);
        }, 220);
      } else if (index === loopedData.length - 1) {
        setTimeout(() => {
          galleryRef.current?.setIndex(1);
        }, 220);
      }
    },
    [canLoop, imageUrls.length, loopedData.length],
  );
  console.log(galleryRef.current?.reset);
  return (
    <Gallery
      ref={galleryRef}
      onVerticalPull={handleVerticalPull}
      pinchMode="free"
      allowPinchPanning
      data={loopedData}
      initialIndex={canLoop ? selectedIndex + 1 : selectedIndex}
      onIndexChange={handleIndexChange}
      windowSize={loopedData.length + 2}
      onTap={(e, index) =>
        onTap ? onTap(imageUrls[loopToNormalIndex(index)]) : undefined
      }
      // keyExtractor={(item, index) => `${item}`}
      renderItem={renderItem}
    />
  );
};

export default LoopingZoomGallery;
