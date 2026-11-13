import React, { useCallback, useMemo, useRef } from "react";
import {
  Gallery,
  VerticalPullOptions,
  type GalleryRefType,
} from "react-native-zoom-toolkit";

export const LoopingZoomGallery = ({
  imageUrls,
  selectedIndex,
  renderItem,
  setSelectedIndex,
  handleVerticalPull,
}: {
  imageUrls: string[];
  selectedIndex: number;
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
}) => {
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
        galleryRef.current?.setIndex(imageUrls.length);
      } else if (index === loopedData.length - 1) {
        galleryRef.current?.setIndex(1);
      }
    },
    [canLoop, imageUrls.length, loopedData.length],
  );

  return (
    <Gallery
      ref={galleryRef}
      onVerticalPull={handleVerticalPull}
      pinchMode="free"
      allowPinchPanning
      data={loopedData}
      initialIndex={canLoop ? selectedIndex + 1 : selectedIndex}
      onIndexChange={handleIndexChange}
      renderItem={renderItem}
    />
  );
};

export default LoopingZoomGallery;
