import { useCallback, useRef, useState } from "react";
import { View, useWindowDimensions, ActivityIndicator } from "react-native";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
import YoutubeIframe, {
  PLAYER_STATES,
  YoutubeIframeRef,
} from "react-native-youtube-iframe";

interface YoutubePlayerProps {
  /**
   * Specifies the YouTube Video ID of the video to be played.
   */
  videoId: string;
}

const YoutubePlayer = ({ videoId }: YoutubePlayerProps) => {
  const { width } = useWindowDimensions();
  const startTimeRef = useRef(0);
  const youtubeRef = useRef<YoutubeIframeRef | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const iframeWidth = useCallback(
    () => Math.max(300, Math.round(width * (10 / 12))),
    [width]
  );

  // calculate height using 16:9 aspect ratio
  const iframeHeight = useCallback(
    () => Math.round(iframeWidth() * (9 / 16)),
    [iframeWidth]
  );

  return (
    <>
      {isLoading && (
        <Animated.View
          className="bg-black flex items-center justify-center"
          style={{ height: iframeHeight(), width: iframeWidth() }}
          entering={FadeInRight.delay(300)}
        >
          <ActivityIndicator size={60} color="white" />
        </Animated.View>
      )}
      <View className={isLoading ? "opacity-0" : "opacity-100"}>
        <YoutubeIframe
          webViewStyle={{ borderRadius: 10 }}
          ref={youtubeRef}
          initialPlayerParams={{ start: startTimeRef.current }}
          width={iframeWidth()}
          height={iframeHeight()}
          videoId={videoId}
          onReady={() => {
            setIsLoading(false);
          }}
          onChangeState={(event) => {
            if (event == PLAYER_STATES.PAUSED) {
              youtubeRef.current
                ?.getCurrentTime()
                .then((value) => {
                  startTimeRef.current = value;
                  console.log(startTimeRef.current);
                })
                .catch((error) => {
                  console.log("Error: could not set YT start time - " + error);
                });
              // youtubeRef.current?.seekTo(startTimeRef.current, true);
            }
          }}
        />
      </View>
    </>
  );
};
export default YoutubePlayer;
