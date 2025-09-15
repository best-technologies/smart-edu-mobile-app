import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image,
  Alert,
  Dimensions,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';
// TODO: Migrate to expo-video when stable API is available
// @ts-ignore - expo-av is deprecated but expo-video API is not yet stable
import { Video, ResizeMode } from 'expo-av';

interface Topic {
  id: string;
  title: string;
  description: string;
  videos: any[];
  materials: any[];
  instructions: string;
  order: number;
}

interface VideoUploadModalProps {
  visible: boolean;
  topic: Topic | null;
  subjectId: string;
  onClose: () => void;
}

export function VideoUploadModal({ visible, topic, subjectId, onClose }: VideoUploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: null as any,
    videoFile: null as any,
    videoUri: '',
    thumbnailUri: ''
  });
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [isSimulator, setIsSimulator] = useState(false);
  
  // Detect if running on simulator
  useEffect(() => {
    const checkSimulator = async () => {
      try {
        const deviceType = await Device.getDeviceTypeAsync();
        setIsSimulator(deviceType === 2 || deviceType === 3); // 2 = iOS Simulator, 3 = Android Emulator
      } catch (error) {
        // Fallback to platform check
        setIsSimulator(Platform.OS === 'ios' && !Device.isDevice);
      }
    };
    
    checkSimulator();
  }, []);

  // Safe gallery picker function with simulator detection
  const pickFromGallery = async () => {
    try {
      // Check if running on simulator
      if (isSimulator) {
        Alert.alert(
          'Simulator Detected',
          'Gallery access is limited on simulators. Please use the Files option instead, or test on a physical device.',
          [
            { text: 'Use Files Instead', onPress: () => pickFromFiles() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        return;
      }

      // Request permission first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to select videos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Settings', 
              onPress: () => {
                Alert.alert('Settings', 'Please go to Settings > Privacy > Photos and enable access for this app.');
              }
            }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 1800, // 30 minutes max
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFormData({
          ...formData,
          videoFile: asset,
          videoUri: asset.uri
        });
        Alert.alert('Success', 'Video selected from gallery!');
      }
    } catch (error) {
      console.error('Gallery picker error:', error);
      
      // Provide helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          Alert.alert('Permission Error', 'Please allow access to your photo library in Settings.');
        } else if (error.message.includes('simulator')) {
          Alert.alert('Simulator Limitation', 'Gallery access is limited on simulators. Please use Files instead.');
        } else {
          Alert.alert('Error', 'Failed to access gallery. Please try again or use Files option.');
        }
      } else {
        Alert.alert('Error', 'Failed to access gallery. Please try again.');
      }
    }
  };

  // Safe file picker function
  const pickFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFormData({
          ...formData,
          videoFile: asset,
          videoUri: asset.uri
        });
        Alert.alert('Success', 'Video selected from files!');
      }
    } catch (error) {
      console.error('File picker error:', error);
      Alert.alert('Error', 'Failed to access files. Please try again.');
    }
  };

  // Thumbnail picker function
  const pickThumbnail = async () => {
    try {
      if (isSimulator) {
        Alert.alert(
          'Simulator Limitation',
          'Image picker is limited on simulators. Please test on a physical device or use a default thumbnail.',
          [{ text: 'OK' }]
        );
        return;
      }

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library for thumbnails.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9], // Video aspect ratio
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFormData({
          ...formData,
          thumbnail: asset,
          thumbnailUri: asset.uri
        });
      }
    } catch (error) {
      console.error('Thumbnail picker error:', error);
      Alert.alert('Error', 'Failed to pick thumbnail. Please try again.');
    }
  };

  const handleUploadVideo = async () => {
    try {
      Alert.alert(
        'Choose Video Source',
        'Where would you like to select your video from?',
        [
          {
            text: 'Gallery',
            onPress: pickFromGallery
          },
          {
            text: 'Files',
            onPress: pickFromFiles
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Video upload error:', error);
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const handleUploadThumbnail = async () => {
    try {
      // Request permission first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to select thumbnails.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Settings', 
              onPress: () => {
                Alert.alert('Settings', 'Please go to Settings > Privacy > Photos and enable access for this app.');
              }
            }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      // console.log('Thumbnail picker result:', result); // Debug log

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setFormData({
          ...formData,
          thumbnail: uri
        });
        Alert.alert('Success', 'Thumbnail selected!');
      }
    } catch (error) {
      console.error('Thumbnail picker error:', error);
      Alert.alert('Error', 'Failed to pick thumbnail. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Video title is required');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Video description is required');
      return;
    }
    if (!formData.videoFile) {
      Alert.alert('Error', 'Please select a video file');
      return;
    }

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('subject_id', subjectId);
      formDataToSend.append('topic_id', topic?.id || '');
      formDataToSend.append('video', {
        uri: formData.videoFile.uri,
        type: 'video/mp4', // You might want to detect this dynamically
        name: 'video.mp4'
      } as any);

      // Add thumbnail if selected
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', {
          uri: formData.thumbnail.uri,
          type: 'image/jpeg',
          name: 'thumbnail.jpg'
        } as any);
      }

      // TODO: Replace with actual API call
      console.log('Uploading video with payload:', formDataToSend);
      
      // For now, show success message
      Alert.alert(
        'Video Uploaded Successfully!',
        `"${formData.title}" has been uploaded to ${topic?.title}.\n\nYou can now view and manage this video in your subject content.`,
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              // Reset form data
              setFormData({
                title: '',
                description: '',
                thumbnail: null,
                videoFile: null,
                videoUri: '',
                thumbnailUri: ''
              });
              setShowVideoPreview(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload video. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Upload Video
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          {topic && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Adding to: {topic.title}
            </Text>
          )}
        </View>

        {/* Simulator Notice */}
        {isSimulator && (
          <View className="mx-6 mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <View className="flex-row items-center gap-2">
              <Ionicons name="warning" size={16} color="#d97706" />
              <Text className="text-sm text-yellow-700 dark:text-yellow-300">
                🚧 Simulator Detected: Gallery access is limited. Use the "Files" option for testing.
              </Text>
            </View>
          </View>
        )}

        <ScrollView className="flex-1 px-6 py-4">
          {/* Video Upload Section - Compact Design */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Video File
            </Text>
            
            <View className="space-y-3">
              {/* Compact Video Upload Area */}
              <TouchableOpacity
                onPress={handleUploadVideo}
                activeOpacity={0.8}
                className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 items-center justify-center"
              >
                {formData.videoUri ? (
                  <View className="items-center">
                    <Ionicons name="checkmark-circle" size={32} color="#10b981" />
                    <Text className="text-green-600 dark:text-green-400 mt-1 text-center font-medium text-sm">
                      ✓ Video Selected
                    </Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <Ionicons name="videocam-outline" size={32} color="#9ca3af" />
                    <Text className="text-gray-500 dark:text-gray-400 mt-1 text-center text-sm">
                      Tap to upload video
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Quick Upload Buttons - More Compact */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={pickFromGallery}
                  activeOpacity={0.7}
                  className="flex-1 bg-blue-600 py-2 px-3 rounded-lg flex-row items-center justify-center"
                >
                  <Ionicons name="images-outline" size={16} color="white" />
                  <Text className="text-white font-medium text-sm ml-1">
                    {isSimulator ? 'Gallery (Limited)' : 'Gallery'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={pickFromFiles}
                  activeOpacity={0.7}
                  className="flex-1 bg-gray-600 py-2 px-3 rounded-lg flex-row items-center justify-center"
                >
                  <Ionicons name="folder-outline" size={16} color="white" />
                  <Text className="text-white font-medium text-sm ml-1">Files</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Video Preview Section */}
          {formData.videoUri && (
            <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Video Preview
                </Text>
                <TouchableOpacity
                  onPress={() => setShowVideoPreview(!showVideoPreview)}
                  activeOpacity={0.7}
                  className="flex-row items-center gap-1 bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-lg"
                >
                  <Ionicons 
                    name={showVideoPreview ? 'eye-off' : 'eye'} 
                    size={14} 
                    color="#3b82f6" 
                  />
                  <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {showVideoPreview ? 'Hide' : 'Preview'}
                  </Text>
                </TouchableOpacity>
              </View>

              {showVideoPreview ? (
                <View className="h-32 bg-black rounded-xl overflow-hidden">
                  <Video
                    source={{ uri: formData.videoUri }}
                    style={{ flex: 1 }}
                    useNativeControls={true}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                    shouldPlay={false}
                  />
                </View>
              ) : (
                <View className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 items-center justify-center">
                  <View className="items-center">
                    <Ionicons name="play-circle" size={32} color="#3b82f6" />
                    <Text className="text-blue-600 dark:text-blue-400 mt-1 text-center font-medium text-sm">
                      Video Ready
                    </Text>
                  </View>
                </View>
              )}

              <View className="mt-3 flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setShowVideoPreview(!showVideoPreview)}
                  activeOpacity={0.7}
                  className="flex-1 bg-blue-600 py-2 px-3 rounded-lg flex-row items-center justify-center"
                >
                  <Ionicons name="play" size={16} color="white" />
                  <Text className="text-white font-medium text-sm ml-1">
                    {showVideoPreview ? 'Hide' : 'Preview'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setFormData({
                      ...formData,
                      videoFile: null,
                      videoUri: ''
                    });
                    setShowVideoPreview(false);
                  }}
                  activeOpacity={0.7}
                  className="bg-red-600 py-2 px-3 rounded-lg flex-row items-center justify-center"
                >
                  <Ionicons name="trash" size={16} color="white" />
                  <Text className="text-white font-medium text-sm ml-1">Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Thumbnail Section - Compact Design */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Thumbnail (Optional)
              </Text>
              {formData.thumbnailUri && (
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, thumbnail: null, thumbnailUri: '' })}
                  activeOpacity={0.7}
                  className="bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded-lg"
                >
                  <Ionicons name="trash" size={14} color="#dc2626" />
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity
              onPress={pickThumbnail}
              activeOpacity={0.8}
              className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 items-center justify-center"
            >
              {formData.thumbnailUri ? (
                <Image 
                  source={{ uri: formData.thumbnailUri }} 
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera-outline" size={24} color="#9ca3af" />
                  <Text className="text-gray-500 dark:text-gray-400 mt-1 text-center text-xs">
                    Tap to add thumbnail
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Video Details */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Video Details
            </Text>

            {/* Subject Info (Read-only) */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </Text>
              <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-800">
                <Text className="text-gray-900 dark:text-gray-100">
                  {topic?.title || 'Unknown Subject'}
                </Text>
              </View>
            </View>

            {/* Topic Info (Read-only) */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic
              </Text>
              <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-800">
                <Text className="text-gray-900 dark:text-gray-100">
                  {topic?.description || 'No description'}
                </Text>
              </View>
            </View>

              {/* Video Title */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video Title *
                </Text>
                <TextInput
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="Enter video title"
                  placeholderTextColor="#9ca3af"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-black"
                />
              </View>

              {/* Video Description */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Describe what this video covers"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-black"
                />
              </View>
            </View>

          {/* Upload Tips */}
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Upload Tips
            </Text>
            
            <View className="space-y-2">
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                <Text className="text-sm text-blue-800 dark:text-blue-200 flex-1">
                  Keep videos under 30 minutes for better engagement
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                <Text className="text-sm text-blue-800 dark:text-blue-200 flex-1">
                  Use clear, descriptive titles
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                <Text className="text-sm text-blue-800 dark:text-blue-200 flex-1">
                  Add captions for better accessibility
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                <Text className="text-sm text-blue-800 dark:text-blue-200 flex-1">
                  Ensure good audio quality
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View className="bg-white dark:bg-black px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <Text className="text-center font-medium text-gray-700 dark:text-gray-300">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.7}
              className="flex-1 py-3 px-4 bg-blue-600 rounded-lg"
            >
              <Text className="text-center font-medium text-white">
                Upload Video
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default VideoUploadModal;
