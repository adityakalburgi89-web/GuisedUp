import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search authentic moments...',
  onClear,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="px-6 py-2 bg-background">
      <View 
        className={`flex-row items-center h-12 px-4 rounded-full bg-white border ${
          isFocused ? 'border-primary shadow-sm' : 'border-border'
        }`}
      >
        <Search size={18} color={isFocused ? '#5B7FFF' : '#6B7280'} className="mr-2" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="flex-1 h-full text-foreground text-sm font-medium pr-2"
          style={{ paddingVertical: 0 }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && onClear && (
          <TouchableOpacity 
            onPress={onClear}
            className="w-6 h-6 items-center justify-center rounded-full bg-muted active:opacity-75"
          >
            <X size={14} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
