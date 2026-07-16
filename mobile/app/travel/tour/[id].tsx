import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Heart, ChevronDown, ChevronUp } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = ['Tour schedule', 'Accommodation', 'Booking det.'];

const ITINERARY = [
  {
    day: 1,
    title: 'Arrival to Rio de Janeiro',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=200&q=80',
    expanded: true,
    schedule: [
      { period: 'Morning', detail: 'Arrive in Rio de Janeiro and transfer to your hotel' },
      { period: 'Afternoon', detail: 'Free time to relax or explore the nearby area' },
      { period: 'Evening', detail: 'Welcome dinner at a traditional Brazilian restaurant' },
    ],
  },
  {
    day: 2,
    title: 'Rio de Janeiro Highlights',
    image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=200&q=80',
    expanded: false,
    schedule: [
      { period: 'Morning', detail: 'Visit Christ the Redeemer statue' },
      { period: 'Afternoon', detail: 'Sugarloaf Mountain cable car ride' },
      { period: 'Evening', detail: 'Sunset at Ipanema Beach' },
    ],
  },
  {
    day: 3,
    title: 'Amazon Rainforest Day Trip',
    image: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=200&q=80',
    expanded: false,
    schedule: [
      { period: 'Morning', detail: 'Fly to Manaus, gateway to the Amazon' },
      { period: 'Afternoon', detail: 'Jungle boat tour and wildlife spotting' },
      { period: 'Evening', detail: 'Overnight in eco-lodge' },
    ],
  },
];

export default function TourScheduleScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Iconic Brazil</Text>
          <Text style={styles.headerDates}>Wed, Oct 21 – Sun, Nov 1</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Heart size={20} color="#181925" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsWrap}
      >
        {TABS.map((tab, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setActiveTab(idx)}
            style={[styles.tab, activeTab === idx && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Title */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.adventureTitle}>8-Days Brazil Adventure</Text>

        {/* Itinerary */}
        {ITINERARY.map((item) => {
          const isOpen = expandedDays.includes(item.day);
          return (
            <View key={item.day} style={styles.dayCard}>
              <TouchableOpacity
                style={styles.dayHeader}
                onPress={() => toggleDay(item.day)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: item.image }} style={styles.dayImage} />
                <View style={styles.dayHeaderInfo}>
                  <Text style={styles.dayLabel}>Day {item.day}</Text>
                  <Text style={styles.dayTitle}>{item.title}</Text>
                </View>
                {isOpen ? (
                  <ChevronUp size={18} color="#999999" />
                ) : (
                  <ChevronDown size={18} color="#999999" />
                )}
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.dayBody}>
                  {item.schedule.map((s, i) => (
                    <View key={i} style={styles.scheduleItem}>
                      <View style={styles.scheduleTimelineWrap}>
                        <View style={styles.scheduleDot} />
                        {i < item.schedule.length - 1 && <View style={styles.scheduleLine} />}
                      </View>
                      <View style={styles.scheduleContent}>
                        <Text style={styles.schedulePeriod}>{s.period}</Text>
                        <Text style={styles.scheduleDetail}>{s.detail}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookWrap}>
        <TouchableOpacity style={styles.bookBtn}>
          <Text style={styles.bookText}>Book a tour</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#181925' },
  headerDates: { fontSize: 12, color: '#999999', marginTop: 2 },
  tabsWrap: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 16,
    paddingTop: 4,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  tabActive: { backgroundColor: '#181925' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#999999' },
  tabTextActive: { color: '#FFFFFF' },
  scroll: { flex: 1 },
  adventureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181925',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  dayCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
    backgroundColor: '#FFFFFF',
  },
  dayImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  dayHeaderInfo: { flex: 1 },
  dayLabel: { fontSize: 11, fontWeight: '600', color: '#999999', marginBottom: 4 },
  dayTitle: { fontSize: 14, fontWeight: '700', color: '#181925' },
  dayBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 14,
    gap: 0,
  },
  scheduleItem: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  scheduleTimelineWrap: {
    alignItems: 'center',
    width: 14,
  },
  scheduleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#181925',
    marginTop: 4,
  },
  scheduleLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: '#e8e8e8',
    marginTop: 4,
    marginBottom: -10,
  },
  scheduleContent: { flex: 1 },
  schedulePeriod: { fontSize: 11, fontWeight: '700', color: '#999999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  scheduleDetail: { fontSize: 13, color: '#666666', lineHeight: 19 },
  bookWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  bookBtn: {
    backgroundColor: '#918df6',
    borderRadius: 9999,
    paddingVertical: 18,
    alignItems: 'center',
  },
  bookText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
