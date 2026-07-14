import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Edit, Search, MessageSquare } from 'lucide-react-native';
import { AppLayout } from '../../components/AppLayout';

interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup?: boolean;
}

export default function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Active Chat Threads matching the Figma Community Messaging Kit
  const initialThreads: ChatThread[] = [
    {
      id: 'emma',
      name: 'Emma Watson',
      avatar: 'E',
      lastMessage: 'Are we still on for coffee later? ☕️',
      time: '9:41 AM',
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: 'lucas',
      name: 'Lucas Chen',
      avatar: 'L',
      lastMessage: 'Check out this new track I found! 🎵',
      time: 'Yesterday',
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: 'mia',
      name: 'Mia Wong',
      avatar: 'M',
      lastMessage: 'Thanks for the help yesterday! Really appreciate it.',
      time: 'Mon',
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: 'weekend',
      name: 'Weekend Getaway 🌴',
      avatar: 'W',
      lastMessage: 'Oliver: Should we book the Airbnb now?',
      time: 'Sun',
      unreadCount: 3,
      isOnline: false,
      isGroup: true,
    },
  ];

  const [threads] = useState<ChatThread[]>(initialThreads);

  const filteredThreads = threads.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeFriends = threads.filter((t) => t.isOnline);

  const renderThreadItem = ({ item }: { item: ChatThread }) => (
    <TouchableOpacity
      onPress={() => router.push(`/chats/${item.id}` as any)}
      className="flex-row items-center px-6 py-3.5 border-b border-border/40 active:bg-gray-50/80 bg-white"
    >
      {/* Avatar Container */}
      <View className="relative">
        <View className={`w-12 h-12 rounded-full items-center justify-center ${item.isGroup ? 'bg-primary/10' : 'bg-secondary/15'}`}>
          <Text className={`text-base font-bold ${item.isGroup ? 'text-primary' : 'text-secondary'}`}>
            {item.avatar}
          </Text>
        </View>
        
        {/* Active green dot */}
        {item.isOnline && (
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
        )}
      </View>

      {/* Core Message Text */}
      <View className="flex-1 ml-4 pr-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
            {item.name}
          </Text>
          <Text className={`text-xs ${item.unreadCount > 0 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
            {item.time}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between mt-1">
          <Text 
            className={`text-xs flex-1 mr-4 ${item.unreadCount > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          
          {item.unreadCount > 0 && (
            <View className="bg-primary rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center">
              <Text className="text-[10px] font-bold text-white leading-[10px]">
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-border/40">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full border border-border shadow-sm active:opacity-70 bg-white"
          >
            <ArrowLeft size={20} color="#111827" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
            Chats
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/chats/new')}
          className="w-10 h-10 items-center justify-center rounded-full border border-border shadow-sm active:opacity-70 bg-white"
        >
          <Edit size={18} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-3 bg-white">
        <View className="flex-row items-center bg-gray-50 border border-border px-4 py-2.5 rounded-full">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search chats"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-sm text-foreground pr-2 font-medium"
            style={{ padding: 0 }}
          />
        </View>
      </View>

      {/* Online List */}
      {!searchQuery && activeFriends.length > 0 && (
        <View className="bg-white border-b border-border/40 pb-4">
          <Text className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-6 mb-3">
            Active Now
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
          >
            {activeFriends.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                onPress={() => router.push(`/chats/${friend.id}` as any)}
                className="items-center"
              >
                <View className="relative">
                  <View className="w-14 h-14 rounded-full bg-secondary/15 items-center justify-center border border-border/40">
                    <Text className="text-base font-bold text-secondary">
                      {friend.avatar}
                    </Text>
                  </View>
                  <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                </View>
                <Text className="text-xs font-semibold text-foreground mt-1.5">
                  {friend.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Thread list */}
      <FlatList
        data={filteredThreads}
        renderItem={renderThreadItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#FFFFFF' }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8">
            <MessageSquare size={48} color="#9CA3AF" strokeWidth={1.5} />
            <Text className="text-sm font-semibold text-muted-foreground mt-4 text-center">
              No conversations found.
            </Text>
          </View>
        }
      />
    </AppLayout>
  );
}
