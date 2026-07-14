import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { Plus } from 'lucide-react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/40 active:scale-95"
      style={{ elevation: 5 }}
    >
      <Plus size={28} color="#ffffff" strokeWidth={2.5} />
    </TouchableOpacity>
  );
}
