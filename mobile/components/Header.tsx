import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface HeaderProps {
  userName?: string;
  subtitle?: string;
  avatarUri?: string;
  onAvatarPress?: () => void;
}

export function Header({
  userName = 'Friend',
  subtitle = 'Welcome to GuisedUp',
  avatarUri,
  onAvatarPress,
}: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 pt-2 pb-5 bg-background">
      <View className="flex-1 pr-4">
        <Text
          className="text-[26px] text-foreground"
          style={{
            fontFamily: 'DMSans_700Bold',
            letterSpacing: -0.6,
            lineHeight: 32,
          }}
        >
          Hello, {userName}
        </Text>
        <Text
          className="text-[13px] text-muted-foreground mt-1"
          style={{ fontFamily: 'DMSans_400Regular', letterSpacing: -0.2 }}
        >
          {subtitle}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onAvatarPress}
        activeOpacity={0.85}
        className="w-[42px] h-[42px] rounded-full overflow-hidden border border-border bg-muted"
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} className="w-full h-full" />
        ) : (
          <View className="w-full h-full items-center justify-center bg-lavender">
            <Text
              className="text-sm text-primary-foreground"
              style={{ fontFamily: 'DMSans_700Bold' }}
            >
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
