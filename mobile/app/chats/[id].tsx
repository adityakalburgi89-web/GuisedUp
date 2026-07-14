import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Send, Phone, Video, Plus, Smile } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, SlideInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { AppLayout } from '../../components/AppLayout';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'other';
  reactions: string[];
  senderName?: string;
}

interface ChatDetails {
  name: string;
  avatar: string;
  status: string;
  messages: Message[];
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [inputText, setInputText] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  // Reaction Tray Spring Animation
  const trayScale = useSharedValue(0);
  const trayStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(trayScale.value, { damping: 15 }) }],
    };
  });

  // Mock Conversations matching the Figma Community Messaging Kit
  const initialConversations: Record<string, ChatDetails> = {
    emma: {
      name: 'Emma Watson',
      avatar: 'E',
      status: 'Online',
      messages: [
        {
          id: '1',
          text: 'Hey! Are we still on for coffee later? I found this amazing new place near the park ☕️',
          time: '9:41 AM',
          sender: 'other',
          reactions: ['👍'],
        },
        {
          id: '2',
          text: "Absolutely! I'd love to check it out. Is it that one with the blue door?",
          time: '9:43 AM',
          sender: 'user',
          reactions: ['❤️'],
        },
        {
          id: '3',
          text: 'Look how cozy it is! They even have a fireplace.',
          time: '9:45 AM',
          sender: 'other',
          reactions: [],
        },
        {
          id: '4',
          text: 'Oh wow, that looks perfect! 😍',
          time: '9:46 AM',
          sender: 'user',
          reactions: [],
        },
      ],
    },
    lucas: {
      name: 'Lucas Chen',
      avatar: 'L',
      status: 'Online',
      messages: [
        {
          id: '1',
          text: 'Yo! Check out this new track I found! 🎵',
          time: 'Yesterday',
          sender: 'other',
          reactions: [],
        },
        {
          id: '2',
          text: 'Sweet, let me give it a listen right now!',
          time: 'Yesterday',
          sender: 'user',
          reactions: ['🔥'],
        },
      ],
    },
    mia: {
      name: 'Mia Wong',
      avatar: 'M',
      status: 'Online',
      messages: [
        {
          id: '1',
          text: 'Thanks for the help yesterday! Really appreciate it.',
          time: 'Mon',
          sender: 'other',
          reactions: [],
        },
        {
          id: '2',
          text: 'Anytime! Let me know if you run into any other bugs.',
          time: 'Mon',
          sender: 'user',
          reactions: ['👍'],
        },
      ],
    },
    weekend: {
      name: 'Weekend Getaway 🌴',
      avatar: 'W',
      status: 'Group (4 members)',
      messages: [
        {
          id: '1',
          text: 'Should we book the Airbnb now?',
          time: 'Sun',
          sender: 'other',
          senderName: 'Oliver',
          reactions: [],
        },
        {
          id: '2',
          text: "Yes! Let's get it locked down before prices go up.",
          time: 'Sun',
          sender: 'user',
          reactions: [],
        },
      ],
    },
  };

  const chatKey = (id && initialConversations[id]) ? id : 'emma';
  const chatInfo = initialConversations[chatKey];
  const [messages, setMessages] = useState<Message[]>(chatInfo.messages);

  useEffect(() => {
    setMessages(chatInfo.messages);
  }, [id]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
      reactions: [],
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleOpenReactionTray = (messageId: string) => {
    setSelectedMessageId(messageId);
    trayScale.value = 1;
  };

  const handleAddReaction = (emoji: string) => {
    if (!selectedMessageId) return;

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === selectedMessageId) {
          // If the message already has this reaction, remove it. Otherwise add it.
          const reactions = msg.reactions.includes(emoji)
            ? msg.reactions.filter((r) => r !== emoji)
            : [...msg.reactions, emoji];
          return { ...msg, reactions };
        }
        return msg;
      })
    );

    // Hide Tray
    trayScale.value = 0;
    setSelectedMessageId(null);
  };

  const closeReactionTray = () => {
    trayScale.value = 0;
    setSelectedMessageId(null);
  };

  const emojis = ['❤️', '😂', '😮', '😢', '🙏', '🔥'];

  const renderMessageItem = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View key={item.id} className={`flex-row mb-4 px-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {/* Recipient Profile Avatar for Group Chat */}
        {!isUser && chatKey === 'weekend' && item.senderName && (
          <View className="w-8 h-8 rounded-full bg-secondary/10 items-center justify-center mr-2 self-end">
            <Text className="text-xs font-bold text-secondary">{item.senderName.charAt(0)}</Text>
          </View>
        )}

        <View className="max-w-[75%] relative">
          {/* Group member name */}
          {!isUser && chatKey === 'weekend' && item.senderName && (
            <Text className="text-[10px] font-bold text-muted-foreground ml-1.5 mb-0.5">
              {item.senderName}
            </Text>
          )}

          <TouchableOpacity
            onLongPress={() => handleOpenReactionTray(item.id)}
            activeOpacity={0.9}
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-primary rounded-tr-none'
                : 'bg-gray-100 rounded-tl-none border border-gray-200/50'
            }`}
          >
            <Text className={`text-sm font-medium leading-5 ${isUser ? 'text-white' : 'text-foreground'}`}>
              {item.text}
            </Text>
            
            <View className="flex-row justify-end items-center mt-1">
              <Text className={`text-[9px] ${isUser ? 'text-white/70' : 'text-muted-foreground/80'}`}>
                {item.time}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Render reactions badge */}
          {item.reactions && item.reactions.length > 0 && (
            <View className={`absolute -bottom-2 bg-white px-1.5 py-0.5 rounded-full border border-border shadow-sm flex-row items-center gap-0.5 ${isUser ? 'right-2' : 'left-2'}`}>
              {item.reactions.map((react, i) => (
                <Text key={i} className="text-[10px] leading-[12px]">{react}</Text>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

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
          <View>
            <Text className="text-base font-bold text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
              {chatInfo.name}
            </Text>
            <Text className="text-xs text-muted-foreground font-semibold mt-0.5">
              {chatInfo.status}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3.5">
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full border border-border shadow-sm active:opacity-75 bg-white">
            <Phone size={18} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full border border-border shadow-sm active:opacity-75 bg-white">
            <Video size={18} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Header */}
      <View className="items-center py-3 bg-white">
        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-border/20">
          Today
        </Text>
      </View>

      {/* Message Feed */}
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={closeReactionTray}
        className="flex-1 bg-white"
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      </TouchableOpacity>

      {/* Floating Reaction Tray */}
      {selectedMessageId && (
        <View className="absolute inset-0 bg-black/10 z-40 items-center justify-center">
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={closeReactionTray} 
            className="absolute inset-0"
          />
          <Animated.View 
            style={trayStyle}
            className="flex-row bg-white border border-border p-3.5 rounded-full shadow-2xl gap-3.5 z-50 items-center"
          >
            {emojis.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => handleAddReaction(emoji)}
                className="w-10 h-10 items-center justify-center active:scale-125"
              >
                <Text className="text-2xl leading-[30px]">{emoji}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      )}

      {/* Footer Text Input Bar */}
      <View className="px-6 py-4 bg-white border-t border-border/40">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 border border-border/80 active:opacity-75">
            <Plus size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center bg-gray-50 border border-border px-4 py-2.5 rounded-full">
            <TextInput
              ref={inputRef}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
              className="flex-1 text-sm text-foreground pr-2 font-medium"
              style={{ padding: 0 }}
            />
            <TouchableOpacity className="p-0.5 active:opacity-70">
              <Smile size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSendMessage}
            className={`w-10 h-10 items-center justify-center rounded-full shadow-sm ${
              inputText.trim() ? 'bg-primary' : 'bg-gray-100 border border-border/80'
            }`}
            disabled={!inputText.trim()}
          >
            <Send size={16} color={inputText.trim() ? '#ffffff' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </View>
    </AppLayout>
  );
}
