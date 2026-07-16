import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Phone, Video, Send, Plus, Smile } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'other';
  reactions: string[];
}

const CHAT_DATA: Record<string, { name: string; initials: string; color: string; status: string; messages: Message[] }> = {
  emma: {
    name: 'Emma Watson',
    initials: 'EW',
    color: '#FF6B6B',
    status: 'Online',
    messages: [
      { id: '1', text: 'Hey! Are we still on for coffee later? I found this amazing new place near the park ☕️', time: '9:41 AM', sender: 'other', reactions: ['👍'] },
      { id: '2', text: "Absolutely! I'd love to check it out. Is it that one with the blue door?", time: '9:43 AM', sender: 'user', reactions: [] },
      { id: '3', text: 'Yes! They have the best lattes. And the vibe is super cozy 🔥', time: '9:44 AM', sender: 'other', reactions: ['❤️'] },
      { id: '4', text: 'Perfect! See you at 3pm then?', time: '9:45 AM', sender: 'user', reactions: [] },
      { id: '5', text: "It's a date! Can't wait 😍", time: '9:46 AM', sender: 'other', reactions: [] },
    ],
  },
  lucas: {
    name: 'Lucas Chen',
    initials: 'LC',
    color: '#4ECDC4',
    status: 'Online',
    messages: [
      { id: '1', text: 'Yo! Check out this new track I found! 🎵', time: 'Yesterday', sender: 'other', reactions: [] },
      { id: '2', text: 'Sending it now, you NEED to hear this drop', time: 'Yesterday', sender: 'other', reactions: [] },
      { id: '3', text: 'Sweet, let me give it a listen right now!', time: 'Yesterday', sender: 'user', reactions: ['🔥'] },
    ],
  },
  mia: {
    name: 'Mia Wong',
    initials: 'MW',
    color: '#45B7D1',
    status: 'Away',
    messages: [
      { id: '1', text: 'Thanks for the help yesterday! Really appreciate it.', time: 'Mon', sender: 'other', reactions: [] },
      { id: '2', text: 'Anytime! Let me know if you run into any other bugs.', time: 'Mon', sender: 'user', reactions: ['👍'] },
    ],
  },
  weekend: {
    name: 'Weekend Getaway 🌴',
    initials: 'WG',
    color: '#96CEB4',
    status: '4 members',
    messages: [
      { id: '1', text: 'Should we book the Airbnb now?', time: 'Sun', sender: 'other', reactions: [] },
      { id: '2', text: "Yes! Let's do it before prices go up.", time: 'Sun', sender: 'user', reactions: [] },
    ],
  },
};

const EMOJIS = ['❤️', '😂', '😮', '😢', '🙏', '🔥'];

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chatKey = (id && CHAT_DATA[id]) ? id : 'emma';
  const chat = CHAT_DATA[chatKey];

  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [inputText, setInputText] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const trayScale = useSharedValue(0);

  const trayStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(trayScale.value, { damping: 15 }) }],
    opacity: trayScale.value,
  }));

  const openTray = (msgId: string) => {
    setSelectedId(msgId);
    trayScale.value = 1;
  };

  const closeTray = () => {
    trayScale.value = 0;
    setSelectedId(null);
  };

  const addReaction = (emoji: string) => {
    if (!selectedId) return;
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== selectedId) return m;
        const reactions = m.reactions.includes(emoji)
          ? m.reactions.filter((r) => r !== emoji)
          : [...m.reactions, emoji];
        return { ...m, reactions };
      })
    );
    closeTray();
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
      reactions: [],
    };
    setMessages((prev) => [...prev, msg]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'user';
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowRight : styles.msgRowLeft]}>
        {!isMe && (
          <View style={[styles.msgAvatar, { backgroundColor: chat.color + '25' }]}>
            <Text style={[styles.msgAvatarText, { color: chat.color }]}>{chat.initials}</Text>
          </View>
        )}
        <View style={{ maxWidth: '70%' }}>
          <TouchableOpacity
            onLongPress={() => openTray(item.id)}
            activeOpacity={0.85}
            style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
          >
            <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextOther]}>
              {item.text}
            </Text>
          </TouchableOpacity>
          <View style={[styles.bubbleMeta, isMe ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
            {item.reactions.length > 0 && (
              <View style={[styles.reactions, isMe ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]}>
                {item.reactions.map((r, i) => (
                  <Text key={i} style={styles.reactionEmoji}>{r}</Text>
                ))}
              </View>
            )}
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft size={20} color="#181925" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCenter} activeOpacity={0.7}>
          <View style={[styles.headerAvatar, { backgroundColor: chat.color + '25' }]}>
            <Text style={[styles.headerAvatarText, { color: chat.color }]}>{chat.initials}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{chat.name}</Text>
            <Text style={styles.headerStatus}>{chat.status}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Phone size={18} color="#181925" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Video size={18} color="#181925" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date label */}
      <View style={styles.dateLabelWrap}>
        <Text style={styles.dateLabel}>Today</Text>
      </View>

      {/* Messages */}
      <TouchableOpacity activeOpacity={1} onPress={closeTray} style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      </TouchableOpacity>

      {/* Reaction Tray */}
      {selectedId && (
        <View style={styles.trayOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={closeTray} />
          <Animated.View style={[styles.tray, trayStyle]}>
            {EMOJIS.map((emoji) => (
              <TouchableOpacity key={emoji} onPress={() => addReaction(emoji)} style={styles.trayEmoji}>
                <Text style={styles.trayEmojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      )}

      {/* Input Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputIconBtn}>
            <Plus size={20} color="#918df6" />
          </TouchableOpacity>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Message..."
              placeholderTextColor="#999999"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
              style={styles.textInput}
              multiline
            />
            <TouchableOpacity>
              <Smile size={18} color="#999999" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={sendMessage}
            style={[styles.sendBtn, inputText.trim() && styles.sendBtnActive]}
            disabled={!inputText.trim()}
          >
            <Send size={16} color={inputText.trim() ? '#FFFFFF' : '#999999'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 4,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 12,
    fontWeight: '700',
  },
  headerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#181925',
  },
  headerStatus: {
    fontSize: 11,
    color: '#33c758',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 6,
  },
  dateLabelWrap: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999999',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    letterSpacing: 0.5,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 8,
  },
  msgRowLeft: {
    justifyContent: 'flex-start',
  },
  msgRowRight: {
    justifyContent: 'flex-end',
  },
  msgAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  msgAvatarText: {
    fontSize: 10,
    fontWeight: '700',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMe: {
    backgroundColor: '#918df6',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: '#FFFFFF',
  },
  bubbleTextOther: {
    color: '#181925',
  },
  bubbleMeta: {
    marginTop: 4,
    paddingHorizontal: 4,
    gap: 2,
  },
  reactions: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    gap: 2,
  },
  reactionEmoji: {
    fontSize: 12,
  },
  timeText: {
    fontSize: 10,
    color: '#999999',
    fontWeight: '500',
  },
  trayOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  tray: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  trayEmoji: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  trayEmojiText: {
    fontSize: 26,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  inputIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#918df615',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#181925',
    padding: 0,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: '#918df6',
  },
});
