import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface SubscriptionTabProps {
  data: {
    plan: { name: string; price: number; billingCycle: string; startDate: string; endDate: string; status: string };
    status: string;
    billingCycle: string;
    amount: number;
    nextBillingDate: string;
    features: Array<{ name: string; included: boolean; description: string }>;
    usage: { students: number; teachers: number; storage: string; currentStudents: number; currentTeachers: number; storageUsed: number; tokensUsedThisMonth: number };
    limits: { maxStudents: number; maxTeachers: number; maxStorage: number; maxTokensPerMonth: number; maxAiRequests: number; maxFileSize: number; maxVideoDuration: number; maxCloudStorage: number; storageLimit: number; tokensPerStudent: number; tokensPerTeacher: number; maxFilesPerUser: number; aiChatSessions: number };
    paymentHistory?: Array<{
      id: string;
      date: string;
      amount: number;
      status: string;
      method: string;
      plan: string;
      currency: string;
      invoice: string;
    }>;
  };
}

interface UsageBarProps {
  label: string;
  current: number;
  max: number;
  unit: string;
  color: string;
}

const UsageBar = ({ label, current, max, unit, color }: UsageBarProps) => {
  const percentage = (current / max) * 100;
  const isWarning = percentage > 80;
  const isDanger = percentage > 95;
  
  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Text>
        <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {current.toLocaleString()} / {max.toLocaleString()} {unit}
        </Text>
      </View>
      <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <View 
          className={`h-full rounded-full ${
            isDanger ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </View>
      <View className="flex-row justify-between items-center mt-1">
        <Text className={`text-xs ${
          isDanger ? 'text-red-600 dark:text-red-400' : 
          isWarning ? 'text-yellow-600 dark:text-yellow-400' : 
          'text-green-600 dark:text-green-400'
        }`}>
          {percentage.toFixed(1)}% used
        </Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {(max - current).toLocaleString()} {unit} remaining
        </Text>
      </View>
    </View>
  );
};

interface FeatureRowProps {
  name: string;
  included: boolean;
  description: string;
}

const FeatureRow = ({ name, included, description }: FeatureRowProps) => (
  <View className="flex-row items-start py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
    <View className={`w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5 ${
      included ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
    }`}>
      <Ionicons 
        name={included ? 'checkmark' : 'close'} 
        size={14} 
        color={included ? '#10B981' : '#6B7280'} 
      />
    </View>
    <View className="flex-1">
      <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
        {name}
      </Text>
      <Text className="text-xs text-gray-500 dark:text-gray-400">
        {description}
      </Text>
    </View>
  </View>
);

interface PaymentRowProps {
  payment: {
    id: string;
    date: string;
    amount: number;
    status: string;
    method: string;
    plan: string;
    currency: string;
    invoice: string;
  };
  isLast?: boolean;
}

const PaymentRow = ({ payment, isLast }: PaymentRowProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View className={`py-4 ${!isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {payment.plan}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(payment.date)} • {payment.method}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-sm font-bold text-gray-900 dark:text-gray-100">
            ₦{payment.amount.toLocaleString()} {payment.currency}
          </Text>
          <View className={`px-2 py-1 rounded-full mt-1 ${
            payment.status === 'Paid' ? 'bg-green-100 dark:bg-green-900/30' :
            payment.status === 'Failed' ? 'bg-red-100 dark:bg-red-900/30' :
            'bg-yellow-100 dark:bg-yellow-900/30'
          }`}>
            <Text className={`text-xs font-medium ${
              payment.status === 'Paid' ? 'text-green-700 dark:text-green-300' :
              payment.status === 'Failed' ? 'text-red-700 dark:text-red-300' :
              'text-yellow-700 dark:text-yellow-300'
            }`}>
              {payment.status}
            </Text>
          </View>
        </View>
      </View>
      <Text className="text-xs text-gray-400 dark:text-gray-500">
        Invoice: {payment.invoice}
      </Text>
    </View>
  );
};

export default function SubscriptionTab({ data }: SubscriptionTabProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'Basic': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Professional': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'Enterprise': return 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const daysUntilExpiry = Math.ceil(
    (new Date(data.plan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <ScrollView 
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Current Plan Header */}
      <LinearGradient
        colors={['#9333EA', '#2563EB']} // purple-600 to blue-600
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="rounded-2xl p-6 mb-6"
      >
        <View className="items-center">
          <View className={`px-4 py-2 rounded-full mb-3 ${getPlanBadgeColor(data.plan.name)}`}>
            <Text className="text-sm font-bold">
              {data.plan.name} Plan
            </Text>
          </View>
          <Text className="text-white text-3xl font-bold mb-2">
            ₦{data.plan.price.toLocaleString()}/{data.plan.billingCycle.toLowerCase()}
          </Text>
          <Text className="text-purple-100 text-sm mb-4">
            {formatDate(data.plan.startDate)} - {formatDate(data.plan.endDate)}
          </Text>
          <View className={`px-3 py-1 rounded-full ${
            data.plan.status === 'Active' ? 'bg-green-500' : 
            data.plan.status === 'Suspended' ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            <Text className="text-white text-sm font-medium">
              {data.plan.status}
            </Text>
          </View>
          {daysUntilExpiry <= 30 && (
            <Text className="text-yellow-200 text-sm mt-2">
              ⚠️ Expires in {daysUntilExpiry} days
            </Text>
          )}
        </View>
      </LinearGradient>

      {/* Usage Statistics */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Current Usage
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <UsageBar
            label="Students"
            current={data.usage.currentStudents}
            max={data.limits.maxStudents}
            unit="users"
            color="#3B82F6"
          />
          <UsageBar
            label="Teachers"
            current={data.usage.currentTeachers}
            max={data.limits.maxTeachers}
            unit="users"
            color="#10B981"
          />
          <UsageBar
            label="Storage"
            current={data.usage.storageUsed}
            max={data.limits.storageLimit}
            unit="GB"
            color="#F59E0B"
          />
          <UsageBar
            label="Monthly Tokens"
            current={data.usage.tokensUsedThisMonth}
            max={data.limits.tokensPerStudent * data.usage.currentStudents + data.limits.tokensPerTeacher * data.usage.currentTeachers}
            unit="tokens"
            color="#8B5CF6"
          />
        </View>
      </View>

      {/* Plan Limits */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Plan Limits & Allowances
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <View className="grid grid-cols-2 gap-4">
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Max Students:</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {data.limits.maxStudents.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Max Teachers:</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {data.limits.maxTeachers.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Max File Size:</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {data.limits.maxFileSize} MB
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Files Per User:</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {data.limits.maxFilesPerUser}
                </Text>
              </View>
            </View>
            
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Student Tokens:</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {data.limits.tokensPerStudent.toLocaleString()}/day
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Teacher Tokens:</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {data.limits.tokensPerTeacher.toLocaleString()}/day
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Storage Limit:</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {data.limits.storageLimit} GB
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">AI Sessions:</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {data.limits.aiChatSessions.toLocaleString()}/month
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Features */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Plan Features
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          {data.features.map((feature, index) => (
            <FeatureRow
              key={index}
              name={feature.name}
              included={feature.included}
              description={feature.description}
            />
          ))}
        </View>
      </View>

      {/* Payment History */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Payment History
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          {(data.paymentHistory || []).map((payment, index) => (
            <PaymentRow
              key={payment.id}
              payment={payment}
              isLast={index === (data.paymentHistory?.length || 0) - 1}
            />
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View className="space-y-3">
        <TouchableOpacity 
          className="bg-purple-600 rounded-xl p-4 items-center"
          onPress={() => setShowUpgradeModal(true)}
        >
          <View className="flex-row items-center">
            <Ionicons name="arrow-up-circle-outline" size={24} color="white" />
            <Text className="text-white font-semibold ml-2">Upgrade Plan</Text>
          </View>
        </TouchableOpacity>
        
        <View className="flex-row" style={{ gap: 12 }}>
          <TouchableOpacity className="flex-1 bg-blue-600 rounded-xl p-4 items-center">
            <Ionicons name="card-outline" size={20} color="white" />
            <Text className="text-white font-medium mt-1">Billing</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-green-600 rounded-xl p-4 items-center">
            <Ionicons name="download-outline" size={20} color="white" />
            <Text className="text-white font-medium mt-1">Invoices</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-600 rounded-xl p-4 items-center">
            <Ionicons name="help-circle-outline" size={20} color="white" />
            <Text className="text-white font-medium mt-1">Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upgrade Modal */}
      <Modal
        visible={showUpgradeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-gray-900 rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Upgrade Your Plan
              </Text>
              <TouchableOpacity 
                onPress={() => setShowUpgradeModal(false)}
                className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View className="space-y-4 mb-6">
              <View className="p-4 border border-purple-200 dark:border-purple-800 rounded-xl">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Enterprise Plan
                </Text>
                <Text className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  ₦4,999,000/year
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Best for large institutions with advanced needs
                </Text>
                <View className="space-y-2">
                  <Text className="text-sm text-gray-700 dark:text-gray-300">• Unlimited students and teachers</Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300">• 100 MB max file size</Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300">• 50,000 tokens per teacher/day</Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300">• API access & white labeling</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity className="bg-purple-600 rounded-xl p-4 items-center mb-4">
              <Text className="text-white font-semibold">Contact Sales</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="items-center"
              onPress={() => setShowUpgradeModal(false)}
            >
              <Text className="text-gray-500 dark:text-gray-400">Stay on Current Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
