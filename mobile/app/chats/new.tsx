import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Users, UserPlus, Search } from 'lucide-react-native';
import { AppLayout } from '../../components/AppLayout';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
}

export default function NewChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const suggestedContacts: Contact[] = [
    { id: 'emma', name: 'Emma Watson', avatar: 'E', status: 'Online' },
    { id: 'lucas', name: 'Lucas Chen', avatar: 'L', status: 'Online' },
    { id: 'mia', name: 'Mia Wong', avatar: 'M', status: 'Online' },
    { id: 'oliver', name: 'Oliver Smith', avatar: 'O', status: 'Offline' },
  ];

  const filteredContacts = suggestedContacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      onPress={() => router.push(`/chats/${item.id}` as any)}
      className="flex-row items-center px-6 py-4 border-b border-border/40 active:bg-gray-50/80 bg-white"
    >
      <View className="w-10 h-10 rounded-full bg-secondary/15 items-center justify-center">
        <Text className="text-sm font-bold text-secondary">{item.avatar}</Text>
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-sm font-bold text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
          {item.name}
        </Text>
        <Text className="text-xs text-muted-foreground mt-0.5">{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-border/40">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full border border-border shadow-sm active:opacity-70 bg-white"
          >
            <ArrowLeft size={20} color="#111827" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
            New Message
          </Text>
        </View>
      </View>

      {/* Search Input (To: Name or Number) */}
      <View className="px-6 py-3.5 bg-white border-b border-border/40">
        <View className="flex-row items-center bg-gray-50 border border-border px-4 py-2.5 rounded-full">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            placeholder="To: Name or Number"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-sm text-foreground pr-2 font-medium"
            style={{ padding: 0 }}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View className="bg-white">
        <TouchableOpacity
          onPress={() => console.log('Create new group pressed')}
          className="flex-row items-center px-6 py-4 border-b border-border/40 active:bg-gray-50/80"
        >
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
            <Users size={18} color="#5B7FFF" />
          </View>
          <Text className="ml-4 text-sm font-bold text-foreground">
            Create New Group
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => console.log('Add new contact pressed')}
          className="flex-row items-center px-6 py-4 border-b border-border/40 active:bg-gray-50/80"
        >
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
            <UserPlus size={18} color="#5B7FFF" />
          </View>
          <Text className="ml-4 text-sm font-bold text-foreground">
            Add New Contact
          </Text>
        </TouchableOpacity>
      </View>

      {/* Suggested Header */}
      <View className="px-6 py-3 bg-gray-50">
        <Text className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          Suggested
        </Text>
      </View>

      {/* Contact List */}
      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#FFFFFF' }}
        showsVerticalScrollIndicator={false}
      />
    </AppLayout>
  );
}
