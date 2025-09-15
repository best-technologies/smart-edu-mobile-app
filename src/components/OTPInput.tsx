import React, { useMemo } from 'react';
import { View, TextInput, Platform, TextInputProps } from 'react-native';

interface OTPInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  onComplete?: (code: string) => void;
  length?: number;
  autoFocus?: boolean;
  filledColor?: string;
  emptyColor?: string;
  containerStyle?: object;
  inputStyle?: object;
  keyboardType?: TextInputProps['keyboardType'];
}

export default function OTPInput({
  value,
  onChange,
  onComplete,
  length = 6,
  autoFocus = true,
  containerStyle,
  inputStyle,
  keyboardType = 'number-pad',
}: OTPInputProps) {
  const stringValue = useMemo(() => (value.join('').slice(0, length)), [value, length]);

  const handleTextChange = (text: string) => {
    const numeric = text.replace(/\D/g, '').slice(0, length);
    const nextArray = Array.from({ length }, (_, i) => numeric[i] || '');
    onChange(nextArray);
    if (onComplete && numeric.length === length) {
      onComplete(numeric);
    }
  };

  return (
    <View style={[{ width: '100%' }, containerStyle]}>
      <TextInput
        value={stringValue}
        onChangeText={handleTextChange}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        maxLength={length}
        textContentType="oneTimeCode"
        importantForAutofill="yes"
        style={[
          {
            width: '100%',
            height: 55,
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.25)',
            paddingHorizontal: 14,
            fontSize: 22,
            fontWeight: 'bold',
            color: '#ffffff',
            fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
            letterSpacing: 8,
          },
          inputStyle,
        ]}
        placeholder={Array(length).fill('•').join(' ')}
        placeholderTextColor="rgba(255,255,255,0.5)"
      />
    </View>
  );
}