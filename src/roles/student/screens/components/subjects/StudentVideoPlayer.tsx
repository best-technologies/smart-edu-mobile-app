import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer, VideoSource } from 'expo-video';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { capitalizeWords } from '@/utils/textFormatter';

const { width: screenWidth } = Dimensions.get('window');

interface StudentVideoPlayerProps {
  videoUri?: string;
  videoTitle?: string;
  topicTitle?: string;
  topicDescription?: string;
  topicInstructions?: string;
  subjectName?: string;
  subjectCode?: string;
  onVideoSelected?: (uri: string) => void;
  onClose?: () => void;
}

export function StudentVideoPlayer({ 
  videoUri, 
  videoTitle, 
  topicTitle,
  topicDescription,
  topicInstructions,
  subjectName,
  subjectCode,
  onVideoSelected, 
  onClose 
}: StudentVideoPlayerProps) {
  // Autoplay guard
  const autoPlayedRef = useRef(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | undefined>(videoUri);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const seekBarWidthRef = useRef(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);

  // Simple professional spinner animation
  const spinnerAnim = useRef(new (require('react-native').Animated).Value(0)).current;
  useEffect(() => {
    const { Animated, Easing } = require('react-native');
    const loop = Animated.loop(
      Animated.timing(spinnerAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spinnerAnim]);

  // Create video player with expo-video
  const player = useVideoPlayer(
    videoUri
      ? {
          uri: videoUri,
          // Explicitly mark as progressive MP4 and enable caching on native
          contentType: 'progressive',
          useCaching: true,
        }
      : null
  );

  // Configure player when it's ready
  useEffect(() => {
    if (player) {
      // console.log('Configuring player:', { videoUri, playerStatus: player.status });
      player.loop = false;
      player.muted = false;
      player.volume = 1.0;
      // Emit frequent time updates for smoother progress updates
      player.timeUpdateEventInterval = 0.25;
    }
  }, [player, videoUri]);

  // Note: Player is created with the correct source, no need to replace

  // // Debug logging
  // useEffect(() => {
  //   console.log('VideoPlayer Debug:', {
  //     selectedVideoUri,
  //     playerStatus: player.status,
  //     playerDuration: player.duration,
  //     playerCurrentTime: player.currentTime,
  //     isLoading,
  //     hasError
  //   });
  // }, [selectedVideoUri, player.status, player.duration, player.currentTime, isLoading, hasError]);

  useEffect(() => {
    if (videoUri) {
      // console.log('Video URI received:', videoUri);
      // Check if the URI is valid
      if (videoUri.startsWith('http://') || videoUri.startsWith('https://')) {
        setSelectedVideoUri(videoUri);
        setIsLoading(true);
        setHasError(false);
      } else {
        console.error('Invalid video URI format:', videoUri);
        setHasError(true);
        setIsLoading(false);
      }
    } else {
      setSelectedVideoUri(undefined);
    }
  }, [videoUri]);

  // Do not auto-hide controls; only hide/show on user tap
  useEffect(() => {
    // intentionally empty
  }, [showControls, player.playing]);

  // Monitor player status for loading and error states
  useEffect(() => {
    // console.log('Player status changed:', player.status, 'Video URI:', videoUri);
    if (player.status === 'loading') {
      setIsLoading(true);
      setHasError(false);
    } else if (player.status === 'readyToPlay') {
      // console.log('Video is ready to play!');
      setIsLoading(false);
      setHasError(false);
      // Normalize to milliseconds for UI formatting
      setPlaybackDuration((player.duration || 0) * 1000);
      setPlaybackTime((player.currentTime || 0) * 1000);
      // Do not autoplay here; wait for first frame for smoother start
    } else if (player.status === 'error') {
      setIsLoading(false);
      setHasError(true);
      console.error('Video player error - status:', player.status);
    } else if (player.status === 'idle') {
      // console.log('Player is idle');
    }
  }, [player.status, videoUri]);

  // Heuristic buffering detection
  useEffect(() => {
    // Consider buffering when buffer is behind current time while playing
    const isLikelyBuffering = player.playing && (player.bufferedPosition < player.currentTime + 0.2);
    setIsBuffering(isLikelyBuffering);
  }, [player.playing, player.bufferedPosition, player.currentTime]);

  // Subscribe to timeUpdate events for smooth progress
  useEffect(() => {
    const timeSub = player.addListener?.('timeUpdate', ({ currentTime, bufferedPosition }: any) => {
      // currentTime and bufferedPosition are in seconds per types
      const ctMs = Math.max(0, (currentTime || 0) * 1000);
      setPlaybackTime(ctMs);
      setIsBuffering(player.playing && ((bufferedPosition || 0) * 1000 < ctMs + 200));
    });
    const loadSub = player.addListener?.('sourceLoad', ({ duration }: any) => {
      // duration in seconds
      const durMs = Math.max(0, (duration || 0) * 1000);
      setPlaybackDuration(durMs);
    });
    return () => {
      timeSub?.remove && timeSub.remove();
      loadSub?.remove && loadSub.remove();
    };
  }, [player]);

  // Fallback ticker to ensure progress moves even if events are throttled
  useEffect(() => {
    if (!player || !player.playing) return;
    const id = setInterval(() => {
      if (!isScrubbing) {
        const ctMs = Math.max(0, (player.currentTime || 0) * 1000);
        setPlaybackTime(ctMs);
      }
    }, 300);
    return () => clearInterval(id);
  }, [player, player.playing, isScrubbing]);

  const handlePlayPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSeek = (value: number) => {
    if (playbackDuration > 0) {
      const newPositionMs = (value / 100) * playbackDuration;
      player.currentTime = newPositionMs / 1000;
      setPlaybackTime(newPositionMs);
    }
  };

  const handleSeekBarPress = (event: any) => {
    if (playbackDuration > 0) {
      const { locationX } = event.nativeEvent; // relative to the seek container
      const width = seekBarWidthRef.current || 1;
      const clampedX = Math.max(0, Math.min(width, locationX));
      const seekPercentage = (clampedX / width) * 100;
      handleSeek(seekPercentage);
    }
  };

  const handleSeekBarMove = (event: any) => {
    if (playbackDuration > 0) {
      const { locationX } = event.nativeEvent;
      const width = seekBarWidthRef.current || 1;
      const clampedX = Math.max(0, Math.min(width, locationX));
      const seekPercentage = (clampedX / width) * 100;
      setIsScrubbing(true);
      setPlaybackTime((seekPercentage / 100) * playbackDuration);
    }
  };

  const handleSeekBarRelease = (event: any) => {
    if (playbackDuration > 0) {
      const { locationX } = event.nativeEvent;
      const width = seekBarWidthRef.current || 1;
      const clampedX = Math.max(0, Math.min(width, locationX));
      const seekPercentage = (clampedX / width) * 100;
      handleSeek(seekPercentage);
      setIsScrubbing(false);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    player.volume = clampedVolume;
  };

  const handleDoubleTapSeek = (direction: 'forward' | 'backward') => {
    if (player.duration > 0) {
      const seekAmount = 10; // 10 seconds
      const seekDirection = direction === 'forward' ? seekAmount : -seekAmount;
      player.seekBy(seekDirection);
    }
  };

  const toggleFullscreen = async () => {
    try {
      const ScreenOrientation = require('expo-screen-orientation');
      if (!isFullscreen) {
        // Choose a concrete landscape side to avoid jitter/zoom issues
        const current = await ScreenOrientation.getOrientationAsync();
        const lockTo = current === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
          : ScreenOrientation.OrientationLock.LANDSCAPE_LEFT;
        await ScreenOrientation.lockAsync(lockTo);
        setIsFullscreen(true);
      } else {
        // Lock explicitly to portrait up to fully revert layout
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setIsFullscreen(false);
      }
      setShowControls(true);
    } catch (error) {
      console.warn('Fullscreen toggle unavailable. Did you install expo-screen-orientation?');
      setIsFullscreen((v) => !v);
    }
  };

  // Always restore portrait orientation when leaving this screen
  useEffect(() => {
    return () => {
      try {
        const ScreenOrientation = require('expo-screen-orientation');
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      } catch {}
    };
  }, []);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!playbackDuration) return 0;
    const pct = (playbackTime / playbackDuration) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  if (!selectedVideoUri) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="flex-1 items-center justify-center p-6">
          <View className="items-center mb-8">
            <Ionicons name="videocam-outline" size={80} color="#6b7280" />
            <Text className="text-xl font-bold text-gray-100 mt-4 mb-2">
              No Video Available
            </Text>
            <Text className="text-gray-400 text-center mb-8">
              Video content not found
            </Text>
          </View>

          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="bg-gray-800 py-3 px-6 rounded-xl"
            >
              <Text className="text-gray-300 text-center font-medium">
                Go Back
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  const containerStyle = isFullscreen
    ? ({
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
      })
    : ({
        width: '100%' as const,
        aspectRatio: 16 / 9,
        backgroundColor: 'black',
      });

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar hidden={isFullscreen} style={isFullscreen ? 'light' : 'auto'} />
      <View style={containerStyle}>
        {/* Video Container */}
        <View className="flex-1 relative">
          {player && videoUri ? (
            <VideoView
              key={videoUri} // Force re-render when video changes
              player={player}
              style={{ flex: 1, opacity: videoVisible ? 1 : 0, backgroundColor: 'black' }}
              nativeControls={false}
              contentFit="contain"
              onFirstFrameRender={() => {
                setIsLoading(false);
                // Mask initial decoder flash by revealing after first frame
                setTimeout(() => setVideoVisible(true), 50);
                if (!autoPlayedRef.current && !player.playing) {
                  try {
                    // Small delay before starting playback to avoid initial glitch
                    setTimeout(() => {
                      player.play();
                    }, 50);
                    autoPlayedRef.current = true;
                  } catch {}
                }
              }}
            />
          ) : (
            <View className="flex-1 bg-black items-center justify-center">
              <Text className="text-white text-lg">No video available</Text>
            </View>
          )}

          {/* Loading Overlay */}
          {(isLoading || isBuffering) && (
            <View className="absolute inset-0 bg-black/50 items-center justify-center" style={{ zIndex: 15 }}>
              <View className="bg-black/80 rounded-2xl p-6 items-center">
                <Animated.View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    borderWidth: 4,
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderTopColor: '#ffffff',
                    transform: [{ rotate: spinnerAnim.interpolate({ 
                      inputRange: [0, 1], 
                      outputRange: ['0deg', '360deg'] 
                    })}],
                    marginBottom: 12,
                  }}
                />
                <Text className="text-white text-lg font-medium mb-1">
                  {isLoading ? 'Loading video…' : 'Buffering…'}
                </Text>
                <Text className="text-white/70 text-xs text-center">
                  {isLoading ? 'Preparing playback' : 'Optimizing stream'}
                </Text>
              </View>
            </View>
          )}

          {/* Error Overlay */}
          {hasError && (
            <View className="absolute inset-0 bg-black/50 items-center justify-center" style={{ zIndex: 15 }}>
              <View className="bg-black/80 rounded-2xl p-6 items-center max-w-xs">
                <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                <Text className="text-white text-lg font-medium mt-4 mb-2 text-center">
                  Video Error
                </Text>
                <Text className="text-white/70 text-sm text-center mb-4">
                  Failed to load video. Please check your connection and try again.
                </Text>
                <TouchableOpacity
                  onPress={async () => {
                    setHasError(false);
                    setIsLoading(true);
                    // Retry loading the video without blocking UI
                    if (selectedVideoUri) {
                      try {
                        await player.replaceAsync({
                          uri: selectedVideoUri,
                          contentType: 'progressive',
                          useCaching: true,
                        });
                      } catch (e) {
                        console.error('Retry failed:', e);
                        setHasError(true);
                        setIsLoading(false);
                      }
                    }
                  }}
                  activeOpacity={0.7}
                  className="bg-red-500 py-2 px-4 rounded-lg"
                >
                  <Text className="text-white font-medium">Retry</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Double-tap areas for seeking */}
          <View className="absolute inset-0 flex-row">
            <TouchableOpacity
              onPress={() => handleDoubleTapSeek('backward')}
              activeOpacity={1}
              className="flex-1"
              style={{ zIndex: 1 }}
            />
            <TouchableOpacity
              onPress={() => handleDoubleTapSeek('forward')}
              activeOpacity={1}
              className="flex-1"
              style={{ zIndex: 1 }}
            />
          </View>

          {/* Overlay Controls */}
          {showControls && (
            <View className="absolute inset-0 bg-transparent" pointerEvents="box-none" style={{ zIndex: 10 }}>
              {/* Centered transport controls */}
              <View className="absolute inset-0 items-center justify-center px-4" pointerEvents="box-none">
                <View className="w-full flex-row items-center justify-between">
                  {/* Left 10s back */}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDoubleTapSeek('backward');
                    }}
                    activeOpacity={0.7}
                    className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                  >
                    <Ionicons name="play-back" size={20} color="white" />
                  </TouchableOpacity>

                  {/* Center play/pause and time */}
                  <View className="items-center">
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handlePlayPause();
                      }}
                      activeOpacity={0.7}
                      className="h-12 w-12 items-center justify-center rounded-full bg-white/20 mb-2"
                    >
                      <Ionicons
                        name={player.playing ? 'pause' : 'play'}
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>
                    <Text className="text-white text-sm">
                      {formatTime(playbackTime)} / {formatTime(playbackDuration || (player.duration || 0) * 1000)}
                    </Text>
                  </View>

                  {/* Right 10s forward */}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDoubleTapSeek('forward');
                    }}
                    activeOpacity={0.7}
                    className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                  >
                    <Ionicons name="play-forward" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Seek Bar pinned to bottom within video */}
              <View className="absolute left-0 right-0 bottom-0 p-4">
                <TouchableOpacity
                  {...({
                    onStartShouldSetResponder: () => true,
                    onMoveShouldSetResponder: () => true,
                    onResponderGrant: handleSeekBarPress,
                    onResponderMove: handleSeekBarMove,
                    onResponderRelease: handleSeekBarRelease,
                  } as any)}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleSeekBarPress(e);
                  }}
                  activeOpacity={1}
                  className="h-8 justify-center"
                  onLayout={(e) => {
                    seekBarWidthRef.current = e.nativeEvent.layout.width;
                  }}
                >
                  <View className="h-1 bg-white/30 rounded-full relative">
                    <View
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                    <View
                      className="absolute top-0 h-4 w-4 bg-red-500 rounded-full -mt-1.5"
                      style={{ left: `${getProgressPercentage()}%`, marginLeft: -8 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Fullscreen toggle button */}
              <View className="absolute right-4" style={{ bottom: 56 }}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  activeOpacity={0.7}
                  className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                >
                  <Ionicons
                    name={isFullscreen ? 'contract-outline' : 'expand-outline'}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Tap to Show/Hide Controls - overlay toggler */}
          <TouchableOpacity
            onPress={() => setShowControls(!showControls)}
            activeOpacity={1}
            className="absolute inset-0"
            style={{ zIndex: 5 }}
          />
        </View>
      </View>

      {/* Video Details Section */}
      {!isFullscreen && (
      <View className="flex-1 bg-white dark:bg-gray-900 p-6">
        <View className="space-y-4">
          {/* Video Title */}
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Video Lesson
            </Text>
            <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {videoTitle ? capitalizeWords(videoTitle) : 'Untitled Video'}
            </Text>
          </View>

          {/* Subject & Topic Info */}
          <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <View className="flex-row items-center gap-3 mb-3">
              <Ionicons name="book-outline" size={20} color="#3b82f6" />
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Subject
              </Text>
            </View>
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {subjectName ? capitalizeWords(subjectName) : 'Subject'}
            </Text>
            
            <View className="flex-row items-center gap-3 mb-3">
              <Ionicons name="document-text-outline" size={20} color="#10b981" />
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Topic
              </Text>
            </View>
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {topicTitle ? capitalizeWords(topicTitle) : 'Untitled Topic'}
            </Text>
            {topicDescription && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {capitalizeWords(topicDescription)}
              </Text>
            )}
          </View>

          {/* Instructions */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
            <View className="flex-row items-center gap-3 mb-2">
              <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
              <Text className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Instructions
              </Text>
            </View>
            <Text className="text-sm text-blue-800 dark:text-blue-200 leading-5">
              {topicInstructions ? capitalizeWords(topicInstructions) : 'Watch this video carefully and take notes on the key concepts. Pay attention to the examples shown and practice the problems discussed in the video.'}
            </Text>
          </View>

          {/* Video Stats */}
          <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              Video Information
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600 dark:text-gray-400">Duration</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatTime(playbackDuration)}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600 dark:text-gray-400">Current Position</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatTime(playbackTime)}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600 dark:text-gray-400">Progress</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {Math.round(getProgressPercentage())}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      )}
    </View>
  );
}