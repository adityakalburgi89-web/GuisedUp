import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Home, Clapperboard, Heart, LayoutGrid } from 'lucide-react-native';
import { colors, shadows } from '../lib/tokens';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

const TABS = [
  { name: 'home', icon: Home },
  { name: 'reels', icon: Clapperboard },
  { name: 'activity', icon: Heart },
  { name: 'more', icon: LayoutGrid },
] as const;

export function BottomNavigation({
  activeTab,
  onTabPress,
}: BottomNavigationProps) {
  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 bottom-4 items-center"
    >
      <View
        className="flex-row items-center justify-between bg-carbon rounded-full px-8 py-3.5"
        style={[{ width: '78%', maxWidth: 320 }, shadows.nav]}
      >
        {TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => onTabPress(tab.name)}
              activeOpacity={0.7}
              className="items-center justify-center w-11 h-11"
            >
              <IconComponent
                size={22}
                color={isActive ? colors.paperWhite : 'rgba(255,255,255,0.35)'}
                strokeWidth={isActive ? 2.4 : 1.8}
                fill={isActive && tab.name === 'home' ? colors.paperWhite : 'transparent'}
              />
              {isActive ? (
                <View className="w-1 h-1 rounded-full bg-lavender mt-1" />
              ) : (
                <View className="h-1 mt-1" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
