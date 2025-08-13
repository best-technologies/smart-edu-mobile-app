import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
// TODO: Migrate to expo-video when stable API is available
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VideoPlayerProps {
  videoUri?: string;
  onVideoSelected?: (uri: string) => void;
  onClose?: () => void;
}

export function VideoPlayer({ videoUri, onVideoSelected, onClose }: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | undefined>(videoUri);

  useEffect(() => {
    if (videoUri) {
      setSelectedVideoUri(videoUri);
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

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (Platform.OS === 'ios') {
      StatusBar.setHidden(!isFullscreen);
    }
  };

  const handleVideoStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setCurrentTime(status.positionMillis);
      setDuration(status.durationMillis || 0);
    }
  };

  const pickVideoFromGallery = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 300, // 5 minutes max
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setSelectedVideoUri(uri);
        onVideoSelected?.(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video from gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const pickVideoFromDocuments = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setSelectedVideoUri(uri);
        onVideoSelected?.(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video from documents');
    } finally {
      setIsLoading(false);
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
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center p-6">
          <View className="items-center mb-8">
            <Ionicons name="videocam-outline" size={80} color="#6b7280" />
            <Text className="text-xl font-bold text-gray-100 mt-4 mb-2">
              No Video Selected
            </Text>
            <Text className="text-gray-400 text-center mb-8">
              Choose a video to upload and preview it here
            </Text>
          </View>

          <View className="w-full space-y-4">
            <TouchableOpacity
              onPress={pickVideoFromGallery}
              disabled={isLoading}
              activeOpacity={0.7}
              className="bg-purple-600 py-4 px-6 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="images-outline" size={24} color="white" />
              <Text className="text-white font-semibold text-lg ml-3">
                {isLoading ? 'Loading...' : 'Choose from Gallery'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickVideoFromDocuments}
              disabled={isLoading}
              activeOpacity={0.7}
              className="bg-gray-700 py-4 px-6 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="folder-outline" size={24} color="white" />
              <Text className="text-white font-semibold text-lg ml-3">
                {isLoading ? 'Loading...' : 'Choose from Files'}
              </Text>
            </TouchableOpacity>

            {onClose && (
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                className="bg-gray-800 py-3 px-6 rounded-xl"
              >
                <Text className="text-gray-300 text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const containerStyle = isFullscreen
    ? {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: 'black',
      }
    : {
        width: '100%' as const,
        height: 300,
        backgroundColor: 'black',
      };

  return (
    <SafeAreaView className="flex-1 bg-black">
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
          />

          {/* Overlay Controls */}
          {showControls && (
            <View className="absolute inset-0 bg-black/30">
              {/* Top Controls */}
              <View className="flex-row items-center justify-between p-4">
                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.7}
                  className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>

                <View className="flex-row items-center gap-3">
                  <TouchableOpacity
                    onPress={handleFullscreen}
                    activeOpacity={0.7}
                    className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                  >
                    <Ionicons
                      name={isFullscreen ? 'contract' : 'expand'}
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Center Play Button */}
              <View className="flex-1 items-center justify-center">
                <TouchableOpacity
                  onPress={handlePlayPause}
                  activeOpacity={0.7}
                  className="h-20 w-20 items-center justify-center rounded-full bg-black/50"
                >
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={40}
                    color="white"
                  />
                </TouchableOpacity>
              </View>

              {/* Bottom Controls */}
              <View className="p-4">
                {/* Progress Bar */}
                <View className="mb-4">
                  <View className="h-1 bg-white/30 rounded-full">
                    <View
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </View>
                </View>

                {/* Time and Controls */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Text>

                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity
                      onPress={() => {
                        if (videoRef.current) {
                          videoRef.current.setPositionAsync(Math.max(0, currentTime - 10000));
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="play-back" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handlePlayPause}
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
                      onPress={() => {
                        if (videoRef.current) {
                          videoRef.current.setPositionAsync(Math.min(duration, currentTime + 10000));
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="play-forward" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Tap to Show/Hide Controls */}
          <TouchableOpacity
            onPress={() => setShowControls(!showControls)}
            activeOpacity={1}
            className="absolute inset-0"
            style={{ zIndex: -1 }}
          />
        </View>

        {/* Video Info */}
        {!isFullscreen && (
          <View className="p-4 bg-white dark:bg-gray-900">
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              Video Preview
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Tap the video to show/hide controls. Use the fullscreen button for better viewing.
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={pickVideoFromGallery}
                activeOpacity={0.7}
                className="flex-1 bg-purple-600 py-3 px-4 rounded-lg flex-row items-center justify-center"
              >
                <Ionicons name="images-outline" size={16} color="white" />
                <Text className="text-white font-medium ml-2">Change Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleFullscreen}
                activeOpacity={0.7}
                className="bg-gray-600 py-3 px-4 rounded-lg flex-row items-center justify-center"
              >
                <Ionicons name="expand" size={16} color="white" />
                <Text className="text-white font-medium ml-2">Fullscreen</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default VideoPlayer;
