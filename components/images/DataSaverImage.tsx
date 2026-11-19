import React from "react";
import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native";
import { Image, ImageContentFit, ImageStyle } from "expo-image";
import StyledLabel from "../styledLabel";
import { Pressable } from "react-native-gesture-handler";

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
  style: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
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
        <Pressable
          className="flex"
          onPress={() => {
            console.log("Pressed to view image.");
            onUnlock(uri);
          }}
        >
          <View className="rounded-full border-4 border-borderColor-primary bg-bgColor-spotlight px-5 py-3">
            <StyledLabel
              label={
                fileSizeLabel ? `View Image (${fileSizeLabel})` : "View Image"
              }
            />
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={!Boolean(onPress)} style={style}>
      <Image
        source={{ uri }}
        style={style}
        contentFit={contentFit}
        cachePolicy="memory-disk"
        transition={300}
        recyclingKey={uri}
        placeholder={{ thumbhash: imageHash }}
        placeholderContentFit={contentFit}
      />
    </Pressable>
  );
};

export const DataSaverImagePlaceholder = ({
  style,
  containerStyle,
}: DataSaverImagePlaceholderProps) => {
  return (
    <View
      style={[style, containerStyle]}
      className="items-center justify-center bg-bgColor-primary"
    >
      <ActivityIndicator size="large" className="color-highlight" />
    </View>
  );
};
