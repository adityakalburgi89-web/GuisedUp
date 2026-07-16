import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Search, UserPlus, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Contact {
  id: string;
  name: string;
  initials: string;
  color: string;
  status: string;
}

const CONTACTS: Contact[] = [
  { id: 'emma', name: 'Emma Watson', initials: 'EW', color: '#FF6B6B', status: 'Available' },
  { id: 'lucas', name: 'Lucas Chen', initials: 'LC', color: '#4ECDC4', status: 'Busy' },
  { id: 'mia', name: 'Mia Wong', initials: 'MW', color: '#45B7D1', status: 'Available' },
  { id: 'oliver', name: 'Oliver Park', initials: 'OP', color: '#FECA57', status: 'Offline' },
  { id: 'sophie', name: 'Sophie Turner', initials: 'ST', color: '#FF9FF3', status: 'Available' },
];

export default function NewMessageScreen() {
  const [search, setSearch] = useState('');

  const filtered = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactRow}
      onPress={() => router.push(`/chats/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={[styles.avatar, { backgroundColor: item.color + '25' }]}>
        <Text style={[styles.avatarText, { color: item.color }]}>{item.initials}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactStatus}>{item.status}</Text>
      </View>
      <View style={[
        styles.statusDot,
        { backgroundColor: item.status === 'Available' ? '#33c758' : item.status === 'Busy' ? '#FF6B6B' : '#999999' }
      ]} />
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
        <Text style={styles.headerTitle}>New Message</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* To: input */}
      <View style={styles.toWrap}>
        <Text style={styles.toLabel}>To:</Text>
        <TextInput
          placeholder="Name or number..."
          placeholderTextColor="#999999"
          value={search}
          onChangeText={setSearch}
          style={styles.toInput}
          autoFocus
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <View style={[styles.actionIcon, { backgroundColor: '#918df620' }]}>
            <Users size={18} color="#918df6" />
          </View>
          <Text style={styles.actionText}>Create New Group</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionBtn}>
          <View style={[styles.actionIcon, { backgroundColor: '#4ECDC420' }]}>
            <UserPlus size={18} color="#4ECDC4" />
          </View>
          <Text style={styles.actionText}>Add New Contact</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Contacts */}
      <Text style={styles.sectionLabel}>Suggested</Text>
      <FlatList
        data={filtered}
        renderItem={renderContact}
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
    fontSize: 18,
    fontWeight: '700',
    color: '#181925',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
    gap: 12,
  },
  toLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#918df6',
  },
  toInput: {
    flex: 1,
    fontSize: 15,
    color: '#181925',
    padding: 0,
  },
  actions: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#181925',
  },
  actionArrow: {
    fontSize: 20,
    color: '#999999',
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
    marginLeft: 66,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#181925',
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: 13,
    color: '#999999',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
