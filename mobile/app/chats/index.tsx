import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Edit, Search, MessageSquarePlus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChatThread {
  id: string;
  name: string;
  initials: string;
  color: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup?: boolean;
}

const THREADS: ChatThread[] = [
  {
    id: 'emma',
    name: 'Emma Watson',
    initials: 'EW',
    color: '#FF6B6B',
    lastMessage: 'Are we still on for coffee later? ☕️',
    time: '9:41 AM',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 'lucas',
    name: 'Lucas Chen',
    initials: 'LC',
    color: '#4ECDC4',
    lastMessage: 'Check out this new track I found! 🎵',
    time: 'Yesterday',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 'mia',
    name: 'Mia Wong',
    initials: 'MW',
    color: '#45B7D1',
    lastMessage: 'Thanks for the help yesterday! Really appreciate it.',
    time: 'Mon',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 'weekend',
    name: 'Weekend Getaway 🌴',
    initials: 'WG',
    color: '#96CEB4',
    lastMessage: 'Oliver: Should we book the Airbnb now?',
    time: 'Sun',
    unreadCount: 3,
    isOnline: false,
    isGroup: true,
  },
];

export default function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = THREADS.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeNow = THREADS.filter((t) => t.isOnline);

  const renderThread = ({ item }: { item: ChatThread }) => (
    <TouchableOpacity
      style={styles.threadRow}
      onPress={() => router.push(`/chats/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, { backgroundColor: item.color + '25' }]}>
          <Text style={[styles.avatarText, { color: item.color }]}>{item.initials}</Text>
        </View>
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.threadInfo}>
        <View style={styles.threadTop}>
          <Text style={styles.threadName} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.threadTime, item.unreadCount > 0 && styles.threadTimeActive]}>
            {item.time}
          </Text>
        </View>
        <View style={styles.threadBottom}>
          <Text style={[styles.threadPreview, item.unreadCount > 0 && styles.threadPreviewBold]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft size={20} color="#181925" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          onPress={() => router.push('/chats/new' as any)}
          style={styles.iconBtn}
        >
          <MessageSquarePlus size={20} color="#918df6" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Search size={16} color="#999999" />
          <TextInput
            placeholder="Search messages..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Active Now */}
      {!searchQuery && activeNow.length > 0 && (
        <View>
          <Text style={styles.sectionLabel}>Active Now</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeList}
          >
            {activeNow.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                style={styles.activeItem}
                onPress={() => router.push(`/chats/${friend.id}` as any)}
              >
                <View style={styles.activeAvatarWrap}>
                  <View style={[styles.activeAvatar, { backgroundColor: friend.color + '25' }]}>
                    <Text style={[styles.activeAvatarText, { color: friend.color }]}>
                      {friend.initials}
                    </Text>
                  </View>
                  <View style={styles.activeOnlineDot} />
                </View>
                <Text style={styles.activeName}>{friend.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Divider */}
      <Text style={styles.sectionLabel}>Recent</Text>

      {/* Thread List */}
      <FlatList
        data={filtered}
        renderItem={renderThread}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181925',
    letterSpacing: -0.3,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#181925',
    padding: 0,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 4,
  },
  activeList: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 16,
  },
  activeItem: {
    alignItems: 'center',
    gap: 6,
  },
  activeAvatarWrap: {
    position: 'relative',
  },
  activeAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  activeOnlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#33c758',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  activeName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#181925',
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#33c758',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  threadInfo: {
    flex: 1,
    marginLeft: 14,
  },
  threadTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  threadName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#181925',
    flex: 1,
    marginRight: 8,
  },
  threadTime: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
  },
  threadTimeActive: {
    color: '#918df6',
    fontWeight: '600',
  },
  threadBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  threadPreview: {
    fontSize: 13,
    color: '#999999',
    flex: 1,
    marginRight: 8,
    fontWeight: '400',
  },
  threadPreviewBold: {
    color: '#181925',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#918df6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
