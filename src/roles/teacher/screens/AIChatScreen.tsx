import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';

type AIChatRouteParams = {
  materialTitle?: string;
  materialDescription?: string;
  materialUrl?: string;
};

type AIChatRouteProp = RouteProp<{ AIChat: AIChatRouteParams }, 'AIChat'>;

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIChatScreen() {
  const route = useRoute<AIChatRouteProp>();
  const { materialTitle, materialDescription, materialUrl } = route.params || {};
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Simulate loading material from vector DB
  useEffect(() => {
    const loadMaterial = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    };

    loadMaterial();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isWaitingForResponse]);

  const handleSendMessage = async () => {
    if (message.trim() && !isWaitingForResponse) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsWaitingForResponse(true);
      
      // Simulate AI response delay
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: `I understand you're asking about "${userMessage.text}". Based on the material "${materialTitle || 'this content'}", I can help you with that. This is a simulated response that would come from the AI backend after processing your question with the material context.`,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsWaitingForResponse(false);
      }, 2000);
    }
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    console.log('Recording:', !isRecording);
  };

  // Loading Screen
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center flex-1">
            <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full items-center justify-center mr-3">
              <Ionicons name="sparkles" size={18} color="#8B5CF6" />
            </View>
            <View className="flex-1">
              {materialTitle && (
                <Text className="text-sm font-medium text-purple-600 dark:text-purple-400" numberOfLines={1}>
                  {materialTitle}
                </Text>
              )}
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Chat Assistant
              </Text>
            </View>
          </View>
        </View>

        {/* Loading Content */}
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center">
            {/* Animated AI Icon */}
            <View className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-full items-center justify-center mb-6">
              <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
            
            {/* Loading Text */}
            <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">
              Initializing Chat
            </Text>
            
            <Text className="text-gray-600 dark:text-gray-400 text-center text-sm leading-6">
              {materialTitle ? (
                <>
                  Loading material: <Text className="font-semibold text-purple-600 dark:text-purple-400">"{materialTitle}"</Text>
                  {'\n\n'}Fetching content...
                </>
              ) : (
                "Preparing AI assistant..."
              )}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full items-center justify-center mr-3">
            <Ionicons name="sparkles" size={18} color="#8B5CF6" />
          </View>
          <View className="flex-1">
            {materialTitle && (
              <Text className="text-sm font-medium text-purple-600 dark:text-purple-400" numberOfLines={1}>
                {materialTitle}
              </Text>
            )}
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI Chat Assistant
            </Text>
          </View>
        </View>
      </View>

      {/* Chat Messages Area */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-4 py-4" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Message - Only show if no messages */}
          {messages.length === 0 && (
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-full items-center justify-center mb-4">
                <Ionicons name="sparkles" size={24} color="#8B5CF6" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                AI Assistant
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center text-sm leading-6">
                {materialTitle ? (
                  <>
                    You're now chatting about <Text className="font-semibold text-purple-600 dark:text-purple-400">"{materialTitle}"</Text>. 
                    {'\n\n'}I can help you with questions pertaining to this material, and I can also assist you in creating practice tests, quizzes, assignments, and exam questions based on this content.
                    {'\n\n'}What would you like to explore or learn about this material?
                  </>
                ) : (
                  "Hi! I'm here to help you with your studies. Ask me anything!"
                )}
              </Text>
            </View>
          )}

          {/* Chat Messages */}
          {messages.map((msg) => (
            <View key={msg.id} className={`mb-4 ${msg.isUser ? 'items-end' : 'items-start'}`}>
              <View className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.isUser 
                  ? 'bg-purple-600 rounded-br-md' 
                  : 'bg-gray-100 dark:bg-gray-800 rounded-bl-md'
              }`}>
                <Text className={`text-sm leading-5 ${
                  msg.isUser 
                    ? 'text-white' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {msg.text}
                </Text>
              </View>
              <Text className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                msg.isUser ? 'text-right' : 'text-left'
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}

          {/* Typing Indicator */}
          {isWaitingForResponse && (
            <View className="mb-4 items-start">
              <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                <View className="flex-row items-center space-x-1">
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <View className="flex-row items-end bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 min-h-[44px]">
            {/* Text Input */}
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={isWaitingForResponse ? "AI is typing..." : "Type your message..."}
              placeholderTextColor="#9ca3af"
              className="flex-1 text-gray-900 dark:text-gray-100 text-base max-h-20"
              multiline
              style={{ textAlignVertical: 'center' }}
              editable={!isWaitingForResponse}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
            />
            
            {/* Record Button */}
            <TouchableOpacity
              onPress={handleRecord}
              activeOpacity={0.7}
              disabled={isWaitingForResponse}
              className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                isRecording 
                  ? 'bg-red-500' 
                  : isWaitingForResponse
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={16} 
                color={isRecording ? "white" : isWaitingForResponse ? "#9ca3af" : "#6b7280"} 
              />
            </TouchableOpacity>
            
            {/* Send Button */}
            <TouchableOpacity
              onPress={handleSendMessage}
              activeOpacity={0.7}
              disabled={!message.trim() || isWaitingForResponse}
              className={`w-8 h-8 rounded-full items-center justify-center ${
                message.trim() && !isWaitingForResponse
                  ? 'bg-purple-600' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <Ionicons 
                name="send" 
                size={16} 
                color={message.trim() && !isWaitingForResponse ? "white" : "#9ca3af"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
