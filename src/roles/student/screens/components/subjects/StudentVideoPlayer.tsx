import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// TODO: Migrate to expo-video when stable API is available
// @ts-ignore - expo-av is deprecated but expo-video API is not yet stable
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
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
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | undefined>(videoUri);
  const [volume, setVolume] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoUri) {
      setSelectedVideoUri(videoUri);
      setIsLoading(true);
      setHasError(false);
    }
  }, [videoUri]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = async (value: number) => {
    if (videoRef.current && duration > 0) {
      const newPosition = (value / 100) * duration;
      await videoRef.current.setPositionAsync(newPosition);
      setCurrentTime(newPosition);
    }
  };

  const handleSeekBarPress = (event: any) => {
    if (duration > 0) {
      const { locationX } = event.nativeEvent;
      const seekBarWidth = screenWidth - 32; // Account for padding
      const seekPercentage = (locationX / seekBarWidth) * 100;
      const newPosition = (seekPercentage / 100) * duration;
      
      setCurrentTime(newPosition);
      
      if (videoRef.current) {
        videoRef.current.setPositionAsync(newPosition);
      }
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (videoRef.current) {
      await videoRef.current.setVolumeAsync(clampedVolume);
    }
  };

  const handleDoubleTapSeek = (direction: 'forward' | 'backward') => {
    if (videoRef.current && duration > 0) {
      const seekAmount = 10000; // 10 seconds
      const newPosition = direction === 'forward' 
        ? Math.min(duration, currentTime + seekAmount)
        : Math.max(0, currentTime - seekAmount);
      
      videoRef.current.setPositionAsync(newPosition);
      setCurrentTime(newPosition);
    }
  };

  const handleVideoStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setCurrentTime(status.positionMillis);
      setDuration(status.durationMillis || 0);
      
      // Check if video is buffering
      if (status.isBuffering) {
        setIsBuffering(true);
      } else {
        setIsBuffering(false);
      }
    } else if (status.error) {
      setIsLoading(false);
      setHasError(true);
      console.error('Video playback error:', status.error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  if (!selectedVideoUri) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
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
      </SafeAreaView>
    );
  }

  const containerStyle = {
    width: '100%' as const,
    height: '50%' as const,
    backgroundColor: 'black',
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View style={containerStyle}>
        {/* Video Container */}
        <View className="flex-1 relative">
          <Video
            ref={videoRef}
            source={{ uri: selectedVideoUri }}
            style={{ flex: 1 }}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={handleVideoStatusUpdate}
            shouldPlay={false}
            volume={volume}
            progressUpdateIntervalMillis={1000}
            positionMillis={0}
            rate={1.0}
            shouldCorrectPitch={true}
            isMuted={false}
          />

          {/* Loading Overlay */}
          {(isLoading || isBuffering) && (
            <View className="absolute inset-0 bg-black/50 items-center justify-center" style={{ zIndex: 15 }}>
              <View className="bg-black/80 rounded-2xl p-6 items-center">
                {/* YouTube-style spinner */}
                <View className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full  mb-4">
                  {/* Custom spinner animation */}
                </View>
                <Text className="text-white text-lg font-medium mb-2">
                  {isLoading ? 'Loading video...' : 'Buffering...'}
                </Text>
                <Text className="text-white/70 text-sm text-center">
                  {isLoading 
                    ? 'Please wait while the video loads' 
                    : 'Loading more content...'
                  }
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
                  onPress={() => {
                    setHasError(false);
                    setIsLoading(true);
                    // Retry loading the video
                    if (videoRef.current) {
                      videoRef.current.loadAsync({ uri: selectedVideoUri }, {}, false);
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
            <View className="absolute inset-0 bg-black/30" style={{ zIndex: 10 }}>
              {/* Top Controls */}
              <View className="flex-row items-center justify-between p-4">
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onClose?.();
                  }}
                  activeOpacity={0.7}
                  className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Center Play Button */}
              <View className="flex-1 items-center justify-center">
                {isBuffering ? (
                  <View className="items-center">
                    <View className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full  mb-2">
                      {/* Small buffering spinner */}
                    </View>
                    <Text className="text-white text-sm opacity-80">Buffering...</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handlePlayPause();
                    }}
                    activeOpacity={0.7}
                    className="h-20 w-20 items-center justify-center rounded-full bg-black/50"
                  >
                    <Ionicons
                      name={isPlaying ? 'pause' : 'play'}
                      size={40}
                      color="white"
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Bottom Controls */}
              <View className="p-4">
                {/* Seek Bar */}
                <View className="mb-4">
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleSeekBarPress(e);
                    }}
                    activeOpacity={1}
                    className="h-8 justify-center"
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

                {/* Time and Controls */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Text>

                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDoubleTapSeek('backward');
                      }}
                      activeOpacity={0.7}
                      className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                    >
                      <Ionicons name="play-back" size={20} color="white" />
                      <Text className="text-white text-xs mt-1">10s</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handlePlayPause();
                      }}
                      activeOpacity={0.7}
                      className="h-12 w-12 items-center justify-center rounded-full bg-white/20"
                    >
                      <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDoubleTapSeek('forward');
                      }}
                      activeOpacity={0.7}
                      className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                    >
                      <Ionicons name="play-forward" size={20} color="white" />
                      <Text className="text-white text-xs mt-1">10s</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </View>
          )}

          {/* Tap to Show/Hide Controls - This should be on top */}
          <TouchableOpacity
            onPress={() => setShowControls(!showControls)}
            activeOpacity={1}
            className="absolute inset-0"
            style={{ zIndex: 5 }}
          />
        </View>
      </View>

      {/* Video Details Section */}
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
                  {formatTime(duration)}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600 dark:text-gray-400">Current Position</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatTime(currentTime)}
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
    </SafeAreaView>
  );
}