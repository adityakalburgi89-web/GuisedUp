import React from 'react';
import { View, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View 
          className="flex-1"
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
