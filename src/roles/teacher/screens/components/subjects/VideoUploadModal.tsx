import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image,
  Alert,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
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
  onClose: () => void;
}

export function VideoUploadModal({ visible, topic, onClose }: VideoUploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoFile: null as any,
    videoUri: '',
    selectedClass: '',
    selectedTopic: '',
    subject: topic?.title || ''
  });
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  const handleUploadVideo = async () => {
    try {
      Alert.alert(
        'Choose Video Source',
        'Where would you like to select your video from?',
        [
          {
            text: 'Gallery',
            onPress: async () => {
              try {
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
                          // This would typically open app settings
                          Alert.alert('Settings', 'Please go to Settings > Privacy > Photos and enable access for this app.');
                        }
                      }
                    ]
                  );
                  return;
                }

                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                  allowsEditing: false, // Changed to false to avoid editing issues
                  quality: 1,
                  videoMaxDuration: 1800, // 30 minutes max
                  allowsMultipleSelection: false,
                });

                console.log('Gallery picker result:', result); // Debug log

                if (!result.canceled && result.assets && result.assets.length > 0) {
                  const asset = result.assets[0];
                  const uri = asset.uri;
                  
                  console.log('Selected video URI:', uri); // Debug log
                  
                  setFormData({
                    ...formData,
                    videoFile: asset,
                    videoUri: uri
                  });
                  Alert.alert('Success', 'Video selected from gallery!');
                } else {
                  console.log('No video selected or picker was canceled');
                }
              } catch (error) {
                console.error('Gallery picker error:', error);
                Alert.alert('Error', 'Failed to access gallery. Please try again.');
              }
            }
          },
          {
            text: 'Files',
            onPress: async () => {
              try {
                const result = await DocumentPicker.getDocumentAsync({
                  type: 'video/*',
                  copyToCacheDirectory: true,
                });

                console.log('File picker result:', result); // Debug log

                if (!result.canceled && result.assets && result.assets.length > 0) {
                  const asset = result.assets[0];
                  const uri = asset.uri;
                  
                  console.log('Selected file URI:', uri); // Debug log
                  
                  setFormData({
                    ...formData,
                    videoFile: asset,
                    videoUri: uri
                  });
                  Alert.alert('Success', 'Video selected from files!');
                }
              } catch (error) {
                console.error('File picker error:', error);
                Alert.alert('Error', 'Failed to access files. Please try again.');
              }
            }
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

  const handleSave = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Video title is required');
      return;
    }
    if (!formData.videoUri) {
      Alert.alert('Error', 'Please select a video file');
      return;
    }
    if (!formData.selectedClass) {
      Alert.alert('Error', 'Please select a class');
      return;
    }
    if (!formData.selectedTopic) {
      Alert.alert('Error', 'Please select or create a topic');
      return;
    }

    // console.log('Saving video:', formData);
    Alert.alert(
      'Video Uploaded Successfully!',
      `"${formData.title}" has been uploaded to ${formData.selectedTopic}.\n\nYou can now view and manage this video in your subject content.`,
      [
        {
          text: 'OK',
          onPress: () => {
            onClose();
            // Reset form data
            setFormData({
              title: '',
              description: '',
              thumbnail: '',
              videoFile: null,
              videoUri: '',
              selectedClass: '',
              selectedTopic: '',
              subject: topic?.title || ''
            });
            setShowVideoPreview(false);
          }
        }
      ]
    );
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

        <ScrollView className="flex-1 px-6 py-4">
          {/* Video Upload Section */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Video File
            </Text>
            
            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleUploadVideo}
                activeOpacity={0.8}
                className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 items-center justify-center"
              >
                {formData.videoUri ? (
                  <View className="items-center">
                    <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                    <Text className="text-green-600 dark:text-green-400 mt-2 text-center font-medium">
                      ✓ Video Selected Successfully
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      Scroll down to preview and edit details
                    </Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <Ionicons name="videocam-outline" size={48} color="#9ca3af" />
                    <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Tap to upload video
                    </Text>
                    <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                      MP4, MOV, AVI up to 30 minutes
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Quick Upload Buttons */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (permissionResult.granted === false) {
                        Alert.alert('Permission Required', 'Please allow access to your photo library.');
                        return;
                      }
                      
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                        allowsEditing: false,
                        quality: 1,
                        videoMaxDuration: 1800,
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
                      console.error('Direct gallery picker error:', error);
                      Alert.alert('Error', 'Failed to access gallery');
                    }
                  }}
                  activeOpacity={0.7}
                  className="flex-1 bg-blue-600 py-2 px-3 rounded-lg flex-row items-center justify-center"
                >
                  <Ionicons name="images-outline" size={16} color="white" />
                  <Text className="text-white font-medium text-sm ml-1">Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
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
                      console.error('Direct file picker error:', error);
                      Alert.alert('Error', 'Failed to access files');
                    }
                  }}
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
                <View className="aspect-video bg-black rounded-xl overflow-hidden">
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
                <View className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 items-center justify-center">
                  <View className="items-center">
                    <Ionicons name="play-circle" size={48} color="#3b82f6" />
                    <Text className="text-blue-600 dark:text-blue-400 mt-2 text-center font-medium">
                      Video Ready for Preview
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      Tap Preview to watch your video
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
                    {showVideoPreview ? 'Hide Preview' : 'Play Video'}
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

          {/* Thumbnail Section */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Video Thumbnail
            </Text>
            
            <TouchableOpacity
              onPress={handleUploadThumbnail}
              activeOpacity={0.8}
              className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 items-center justify-center"
            >
              {formData.thumbnail ? (
                <Image 
                  source={{ uri: formData.thumbnail }} 
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera-outline" size={48} color="#9ca3af" />
                  <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Tap to upload thumbnail
                  </Text>
                  <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                    Recommended: 1280x720px
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

              {/* Subject */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </Text>
                <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-800">
                  <Text className="text-gray-900 dark:text-gray-100">
                    {formData.subject}
                  </Text>
                </View>
              </View>

              {/* Class Selection */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Class *
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'].map((classItem) => (
                    <TouchableOpacity
                      key={classItem}
                      onPress={() => setFormData({ ...formData, selectedClass: classItem })}
                      activeOpacity={0.7}
                      className={`px-3 py-2 rounded-lg border ${
                        formData.selectedClass === classItem
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          formData.selectedClass === classItem
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {classItem}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Topic Selection */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic *
                </Text>
                <View className="flex-row gap-2">
                  <TextInput
                    value={formData.selectedTopic}
                    onChangeText={(text) => setFormData({ ...formData, selectedTopic: text })}
                    placeholder="Enter or select topic"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-black"
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600"
                  >
                    <Ionicons name="list" size={20} color="#6b7280" />
                  </TouchableOpacity>
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
