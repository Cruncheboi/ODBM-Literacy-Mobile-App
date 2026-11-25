import React from "react";
import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native";
import { ImageContentFit, ImageStyle } from "expo-image";
import StyledLabel from "../styledLabel";
import { Pressable } from "react-native-gesture-handler";
import clsx from "clsx";
import StyledImage from "./styledImage";

interface DataSaverImageProps {
  uri: string;
  cacheKey: string;
  isUnlocked: boolean;
  onUnlock: (cacheKey: string) => void;
  style: StyleProp<ImageStyle>;
  /**
   * Runs only when image is displayed.
   */
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  contentFit?: ImageContentFit;
  fileSizeLabel?: string;
  imageHash: string;
}

interface DataSaverImagePlaceholderProps {
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  className?: string;
}

export const DataSaverImage = ({
  uri,
  cacheKey,
  isUnlocked,
  onUnlock,
  style,
  containerStyle,
  contentFit = "cover",
  fileSizeLabel,
  onPress,
  imageHash,
}: DataSaverImageProps) => {
  if (!isUnlocked) {
    return (
      <View
        style={[style, containerStyle]}
        className="items-center justify-center bg-bgColor-primary"
      >
        <Pressable className="flex" onPress={() => onUnlock(uri)}>
          <View className="items-center rounded-full border-4 border-borderColor-primary bg-bgColor-spotlight px-5 py-3">
            <StyledLabel label="View Image" className="p-0" />
            <StyledLabel
              label={fileSizeLabel ? `(${fileSizeLabel})` : ""}
              className="p-0"
            />
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={!Boolean(onPress)} style={style}>
      <StyledImage
        uri={uri}
        imageHash={imageHash}
        style={style}
        contentFit={contentFit}
      />
    </Pressable>
  );
};

export const DataSaverImagePlaceholder = ({
  style,
  containerStyle,
  className,
}: DataSaverImagePlaceholderProps) => {
  return (
    <View
      style={[style, containerStyle]}
      className={clsx(
        "items-center justify-center bg-bgColor-primary",
        className,
      )}
    >
      <ActivityIndicator size="large" className="color-highlight" />
    </View>
  );
};
