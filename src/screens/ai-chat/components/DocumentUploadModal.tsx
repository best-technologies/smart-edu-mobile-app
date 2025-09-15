import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { ApiService } from '@/services';

interface DocumentUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (document: any) => void;
  supportedTypes?: string[];
  maxSize?: string;
  usageLimits?: {
    filesUploadedThisMonth: number;
    maxFilesPerMonth: number;
    totalStorageUsedMB: number;
    maxStorageMB: number;
  } | null;
}

const { width } = Dimensions.get('window');

export default function DocumentUploadModal({ 
  visible, 
  onClose, 
  onSuccess,
  supportedTypes = ['pdf', 'docx', 'txt', 'rtf'],
  maxSize = '50MB',
  usageLimits = null
}: DocumentUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'failed'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressSubscriptionRef = useRef<{ close: () => void } | null>(null);


  const handleFileSelection = async () => {
    // Check usage limits before allowing file selection
    if (usageLimits) {
      if (usageLimits.filesUploadedThisMonth >= usageLimits.maxFilesPerMonth) {
        Alert.alert(
          'Upload Limit Reached',
          `You have reached your monthly upload limit of ${usageLimits.maxFilesPerMonth} files. Please try again next month.`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      if (usageLimits.totalStorageUsedMB >= usageLimits.maxStorageMB) {
        Alert.alert(
          'Storage Limit Reached',
          `You have reached your storage limit of ${usageLimits.maxStorageMB}MB. Please delete some files to free up space.`,
          [{ text: 'OK' }]
        );
        return;
      }
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        // Determine file type based on extension
        let fileType = 'application/octet-stream';
        if (file.name) {
          const extension = file.name.split('.').pop()?.toLowerCase();
          const mimeTypes: { [key: string]: string } = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt': 'text/plain',
            'rtf': 'application/rtf'
          };
          fileType = mimeTypes[extension || ''] || 'application/octet-stream';
        }
        
        // Create file object with proper typing
        const fileWithType = {
          ...file,
          type: fileType
        };
        
        setSelectedFile(fileWithType);
        setUploadStatus('idle');
        setUploadProgress(0);
        setUploadMessage('');
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  const startUpload = async () => {
    if (!selectedFile) {
      console.log('❌ No file selected, returning early');
      return;
    }

    try {
      console.log('🔄 Starting upload process (session-based)...');
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadMessage('Starting upload session...');
      setUploadProgress(0);

      // 1) Create upload session
      const sessionRes = await ApiService.aiChat.startUpload(selectedFile);
      if (!sessionRes.success || !sessionRes.data) {
        throw new Error(sessionRes.message || 'Unable to start upload session');
      }

      const sessionId = (sessionRes.data as any).sessionId;
      const progressEndpoint = (sessionRes.data as any).progressEndpoint;
      // console.log('🆔 Upload session started:', sessionId, 'endpoint:', progressEndpoint);
      setUploadMessage('Uploading document...');

      // 2) Subscribe to progress polling using endpoint path if provided
      const subscription = await ApiService.aiChat.trackUploadProgress(progressEndpoint || sessionId);
      progressSubscriptionRef.current = subscription;

      subscription.onmessage((event) => {
        try {
          // console.log('📡 Progress event:', event.data);
          const data = JSON.parse(event.data);
          // data conforms to UploadProgressData
          const rawProgress = (typeof data.progress === 'number') ? data.progress : parseFloat(data.progress);
          const nextProgress = Number.isFinite(rawProgress) ? Math.max(0, Math.min(100, Math.round(rawProgress))) : uploadProgress;
          // Map backend "stage" to our UI statuses
          const stage = (data.stage || '').toString();
          const nextStatus: typeof uploadStatus = 
            stage === 'completed' ? 'completed' :
            stage === 'failed' ? 'failed' :
            stage === 'processing' ? 'processing' :
            'uploading';

          setUploadProgress(nextProgress);
          setUploadStatus(nextStatus);
          setUploadMessage(data.message || (nextStatus === 'processing' ? 'Processing document...' : 'Uploading document...'));

          Animated.timing(progressAnimation, {
            toValue: nextProgress,
            duration: 300,
            useNativeDriver: false,
          }).start();

          if (nextStatus === 'completed') {
            // Finalize success
            setIsUploading(false);
            setUploadMessage('Upload completed successfully!');
            Animated.timing(progressAnimation, {
              toValue: 100,
              duration: 300,
              useNativeDriver: false,
            }).start();

            // Close after brief pause
            setTimeout(() => {
              onSuccess({
                id: data.materialId || data.sessionId || sessionId,
                title: selectedFile.name,
                status: 'completed',
                documentId: data.materialId || '',
                documentTitle: selectedFile.name,
                documentUrl: '',
                fileType: selectedFile.type,
                processingStatus: 'completed',
                originalName: selectedFile.name,
                size: String(selectedFile.size || ''),
                materialId: data.materialId || '',
              });
              handleClose();
            }, 1200);
          } else if (nextStatus === 'failed') {
            setIsUploading(false);
            setUploadMessage(data.message || 'Upload failed. Please try again.');
            Alert.alert('Upload Failed', data.message || 'Failed to upload document.');
          }
        } catch (e) {
          console.log('Progress parse error:', e);
        }
      });

      subscription.onerror((err) => {
        console.error('Progress tracking error:', err);
        setIsUploading(false);
        setUploadStatus('failed');
        setUploadMessage('Upload failed or was interrupted.');
        // Do not spam alerts repeatedly; show a single alert and stop polling
        try { subscription.close(); } catch {}
        if (progressSubscriptionRef.current) {
          progressSubscriptionRef.current = null;
          Alert.alert('Upload Interrupted', 'Progress tracking stopped due to connection issues. You can retry.');
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('failed');
      setUploadMessage('Upload failed. Please try again.');
      Alert.alert('Upload Failed', 'Failed to upload document. Please try again.');
    } finally {
      // isUploading will be flipped by progress events; keep true during active polling
    }
  };

  const handleClose = () => {
    // Stop any progress polling
    try {
      progressSubscriptionRef.current?.close();
    } catch {}
    progressSubscriptionRef.current = null;
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setUploadMessage('');
    progressAnimation.setValue(0);
    onClose();
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'uploading':
      case 'processing':
        return '#3B82F6';
      case 'completed':
        return '#10B981';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
      case 'processing':
        return 'cloud-upload';
      case 'completed':
        return 'checkmark-circle';
      case 'failed':
        return 'alert-circle';
      default:
        return 'document';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Upload Document
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              disabled={isUploading}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* File Selection */}
          {!selectedFile && (
            <>
              <TouchableOpacity
                onPress={handleFileSelection}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 items-center mb-4"
              >
                <View className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center mb-4">
                  <Ionicons name="cloud-upload" size={32} color="#3B82F6" />
                </View>
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Select Document
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Choose a file to upload
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Supported: {supportedTypes.join(', ').toUpperCase()} • Max {maxSize}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Selected File */}
          {selectedFile && uploadStatus === 'idle' && (
            <View className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="document" size={20} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100" numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedFile(null)}
                  className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 items-center justify-center"
                >
                  <Ionicons name="close" size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Upload Progress */}
          {(uploadStatus === 'uploading' || uploadStatus === 'processing' || uploadStatus === 'completed' || uploadStatus === 'failed') && (
            <View className="mb-6">
              {/* Progress Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                    uploadStatus === 'completed' ? 'bg-green-100 dark:bg-green-900' :
                    uploadStatus === 'failed' ? 'bg-red-100 dark:bg-red-900' :
                    'bg-blue-100 dark:bg-blue-900'
                  }`}>
                    {uploadStatus === 'completed' ? (
                      <Ionicons name="checkmark" size={20} color="#10B981" />
                    ) : uploadStatus === 'failed' ? (
                      <Ionicons name="close" size={20} color="#EF4444" />
                    ) : (
                      <ActivityIndicator size="small" color={getStatusColor()} />
                    )}
                  </View>
                  <View>
                    <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {uploadStatus === 'completed' ? 'Upload Complete' :
                       uploadStatus === 'failed' ? 'Upload Failed' :
                       uploadStatus === 'processing' ? 'Processing Document' :
                       'Uploading Document'}
                    </Text>
                    <Text className="text-xs text-gray-600 dark:text-gray-400">
                      {uploadMessage}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {uploadProgress}%
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <Animated.View
                  className="h-full rounded-full"
                  style={{
                    width: progressAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp',
                    }),
                    backgroundColor: getStatusColor(),
                  }}
                />
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleClose}
              disabled={isUploading}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl items-center"
            >
              <Text className="text-gray-700 dark:text-gray-300 font-medium">
                {isUploading ? 'Cancel' : 'Close'}
              </Text>
            </TouchableOpacity>
            
            {selectedFile && uploadStatus === 'idle' && (
              <TouchableOpacity
                onPress={() => {
                  console.log('🔘 Upload button pressed');
                  startUpload();
                }}
                disabled={isUploading}
                className="flex-1 py-3 px-4 bg-blue-600 rounded-xl items-center"
              >
                <Text className="text-white font-semibold">Upload</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
