import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { colors } from '../lib/tokens';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFilterPress?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  onClear,
  onFilterPress,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="flex-row items-center px-6 gap-3 mb-5">
      <View
        className={`flex-1 flex-row items-center h-12 px-4 rounded-full bg-muted border ${
          isFocused ? 'border-lavender' : 'border-transparent'
        }`}
      >
        <Search size={16} color={isFocused ? colors.lavender : colors.ash} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.ash}
          className="flex-1 h-full text-foreground text-sm ml-2.5"
          style={{
            paddingVertical: 0,
            fontFamily: 'DMSans_400Regular',
            letterSpacing: -0.2,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && onClear && (
          <TouchableOpacity
            onPress={onClear}
            className="w-6 h-6 items-center justify-center rounded-full bg-fog active:opacity-75"
          >
            <X size={12} color={colors.graphite} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={onFilterPress}
        activeOpacity={0.85}
        className="w-12 h-12 rounded-full bg-carbon items-center justify-center"
      >
        <SlidersHorizontal size={18} color={colors.paperWhite} />
      </TouchableOpacity>
    </View>
  );
}
