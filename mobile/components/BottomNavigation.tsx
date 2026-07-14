import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Home, Search, Plus, Heart, User } from 'lucide-react-native';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export function BottomNavigation({
  activeTab,
  onTabPress,
}: BottomNavigationProps) {
  const tabs = [
    { name: 'home', icon: Home, label: 'Home' },
    { name: 'search', icon: Search, label: 'Search' },
    { name: 'create', icon: Plus, label: 'Create', isSpecial: true },
    { name: 'activity', icon: Heart, label: 'Activity' },
    { name: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <View className="flex-row items-center justify-around h-16 bg-white border-t border-border/80 px-4 pb-2 shadow-lg">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.name;

        if (tab.isSpecial) {
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => onTabPress(tab.name)}
              className="w-12 h-12 rounded-full bg-primary items-center justify-center -mt-6 shadow-md shadow-primary/30 active:opacity-90"
            >
              <Plus size={24} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => onTabPress(tab.name)}
            className="items-center justify-center flex-1 py-1"
          >
            <View className={`items-center justify-center p-1.5 rounded-full ${isActive ? 'bg-primary/5' : ''}`}>
              <IconComponent
                size={22}
                color={isActive ? '#5B7FFF' : '#9CA3AF'}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </View>
            <Text className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
