import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors, shadows } from '../lib/tokens';

interface FloatingActionButtonProps {
  onPress: () => void;
}

/** Kept for create flows — soft lavender pill CTA matching Visitors. */
export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="absolute bottom-28 right-6 w-14 h-14 bg-lavender rounded-full items-center justify-center"
      style={shadows.subtle}
    >
      <Plus size={26} color={colors.paperWhite} strokeWidth={2.4} />
    </TouchableOpacity>
  );
}
