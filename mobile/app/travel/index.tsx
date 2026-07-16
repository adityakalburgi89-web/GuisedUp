import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, Home, Clapperboard, Heart, LayoutGrid, Star, ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '../../lib/tokens';

const CATEGORIES = ['Asia', 'Europe', 'South America', 'North America', 'Africa'];

const DESTINATIONS = [
  {
    id: 'rio',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    rating: 5.0,
    reviews: 143,
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
  },
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    rating: 4.8,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  },
  {
    id: 'bali',
    city: 'Bali',
    country: 'Indonesia',
    rating: 4.9,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  },
];

export default function TravelHomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('South America');
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Vanessa</Text>
            <Text style={styles.subtitle}>Welcome to TripGlide</Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={16} color={colors.ash} />
            <TextInput
              placeholder="Search"
              placeholderTextColor={colors.ash}
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.85}>
            <SlidersHorizontal size={18} color={colors.paperWhite} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Select your next trip</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesWrap}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.categoryPill, active && styles.categoryPillActive]}
                activeOpacity={0.85}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {DESTINATIONS.map((dest) => (
          <TouchableOpacity
            key={dest.id}
            style={styles.card}
            onPress={() => router.push(`/travel/${dest.id}` as any)}
            activeOpacity={0.92}
          >
            <Image source={{ uri: dest.image }} style={styles.cardImage} />
            <LinearGradient
              colors={['transparent', 'rgba(24,25,37,0.2)', 'rgba(24,25,37,0.78)']}
              locations={[0.35, 0.55, 1]}
              style={StyleSheet.absoluteFillObject}
            />

            <TouchableOpacity style={styles.cardHeart} activeOpacity={0.85}>
              <Heart size={18} color={colors.carbon} />
            </TouchableOpacity>

            <View style={styles.cardInfo}>
              <View style={styles.cardPanel}>
                <Text style={styles.cardCountry}>{dest.country}</Text>
                <Text style={styles.cardCity}>{dest.city}</Text>
                <View style={styles.cardMeta}>
                  <Star size={12} color={colors.amber} fill={colors.amber} />
                  <Text style={styles.cardRating}>{dest.rating}</Text>
                  <Text style={styles.cardReviews}>{dest.reviews} reviews</Text>
                </View>
                <TouchableOpacity style={styles.seeMoreBtn} activeOpacity={0.9}>
                  <Text style={styles.seeMoreText}>See more</Text>
                  <View style={styles.seeMoreArrow}>
                    <ArrowUpRight size={16} color={colors.paperWhite} strokeWidth={2.4} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={styles.bottomNavWrap} pointerEvents="box-none">
        <View style={styles.bottomNav}>
          {[
            { icon: Home, key: 'home' },
            { icon: Clapperboard, key: 'explore' },
            { icon: Heart, key: 'saved' },
            { icon: LayoutGrid, key: 'more' },
          ].map((item, idx) => {
            const active = activeTab === idx;
            return (
              <TouchableOpacity
                key={item.key}
                style={styles.navItem}
                onPress={() => {
                  setActiveTab(idx);
                  if (idx === 0) router.push('/');
                }}
              >
                <item.icon
                  size={22}
                  color={active ? colors.paperWhite : 'rgba(255,255,255,0.35)'}
                  fill={active && idx === 0 ? colors.paperWhite : 'transparent'}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                {active ? <View style={styles.navDot} /> : <View style={styles.navDotSpacer} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const CARD_H = Math.min(Dimensions.get('window').width * 0.92, 340);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paperWhite },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.carbon,
    letterSpacing: -0.6,
  },
  subtitle: { fontSize: 13, color: colors.ash, marginTop: 4, letterSpacing: -0.2 },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.fog },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mist,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.carbon, padding: 0, letterSpacing: -0.2 },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.carbon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.carbon,
    paddingHorizontal: 24,
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  categoriesWrap: { paddingHorizontal: 24, gap: 10, marginBottom: 20 },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: colors.paperWhite,
    borderWidth: 1,
    borderColor: colors.fog,
  },
  categoryPillActive: { backgroundColor: colors.carbon, borderColor: colors.carbon },
  categoryText: { fontSize: 13, fontWeight: '500', color: colors.ash, letterSpacing: -0.2 },
  categoryTextActive: { color: colors.paperWhite },
  card: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    height: CARD_H,
    borderWidth: 1,
    borderColor: colors.fog,
    ...shadows.card,
  },
  cardImage: { width: '100%', height: '100%', position: 'absolute' },
  cardHeart: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  cardPanel: {
    borderRadius: 20,
    padding: 14,
    backgroundColor: 'rgba(24,25,37,0.55)',
  },
  cardCountry: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '400', marginBottom: 2 },
  cardCity: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.paperWhite,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  cardRating: { fontSize: 12, color: colors.amber, fontWeight: '700' },
  cardReviews: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginLeft: 4 },
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lavender,
    borderRadius: 9999,
    paddingVertical: 6,
    paddingLeft: 16,
    paddingRight: 6,
  },
  seeMoreText: { fontSize: 14, fontWeight: '500', color: colors.paperWhite, letterSpacing: -0.32 },
  seeMoreArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavWrap: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.carbon,
    borderRadius: 9999,
    paddingHorizontal: 28,
    paddingVertical: 14,
    width: '78%',
    maxWidth: 320,
    justifyContent: 'space-between',
    ...shadows.nav,
  },
  navItem: { alignItems: 'center', width: 44 },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.lavender,
    marginTop: 4,
  },
  navDotSpacer: { height: 4, marginTop: 4 },
});
