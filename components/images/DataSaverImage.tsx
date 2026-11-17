import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
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
}

export function DataSaverImage({
  uri,
  cacheKey,
  isUnlocked,
  onUnlock,
  style,
  containerStyle,
  contentFit = "cover",
  fileSizeLabel,
  onPress,
}: DataSaverImageProps) {
  if (!isUnlocked) {
    return (
      <View
        style={[
          style,
          containerStyle,
          {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f0f0f",
          },
        ]}
        className=""
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
        transition={0}
        recyclingKey={uri}
      />
    </Pressable>
  );
}
