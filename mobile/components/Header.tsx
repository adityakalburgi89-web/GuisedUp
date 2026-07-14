import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bell, Search, MessageSquare } from 'lucide-react-native';

interface HeaderProps {
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  onMessagePress?: () => void;
  userName?: string;
}

export function Header({
  onSearchPress,
  onNotificationsPress,
  onMessagePress,
  userName = 'Friend',
}: HeaderProps) {
  // Simple time-based greeting
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-background">
      <View className="flex-1">
        <Text className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          {getGreeting()}
        </Text>
        <Text className="text-2xl font-bold text-foreground mt-0.5" style={{ fontFamily: 'Inter_700Bold' }}>
          {userName}
        </Text>
      </View>
      <View className="flex-row items-center gap-4.5">
        {onSearchPress && (
          <TouchableOpacity 
            onPress={onSearchPress}
            className="w-10 h-10 items-center justify-center rounded-full bg-white border border-border shadow-sm active:opacity-70"
          >
            <Search size={20} color="#111827" />
          </TouchableOpacity>
        )}
        {onMessagePress && (
          <TouchableOpacity 
            onPress={onMessagePress}
            className="w-10 h-10 items-center justify-center rounded-full bg-white border border-border shadow-sm active:opacity-70"
          >
            <MessageSquare size={20} color="#111827" />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          onPress={onNotificationsPress}
          className="w-10 h-10 items-center justify-center rounded-full bg-white border border-border shadow-sm active:opacity-70"
        >
          <Bell size={20} color="#111827" />
        </TouchableOpacity>
        <View className="w-10 h-10 items-center justify-center rounded-full bg-primary border border-white shadow-sm">
          <Text className="text-sm font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
}

