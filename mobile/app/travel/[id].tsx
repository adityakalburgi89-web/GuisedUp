import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Heart, Star, MapPin } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const DEST_DATA: Record<string, any> = {
  rio: {
    city: 'Rio de Janeiro',
    country: 'Brazil',
    rating: 5.0,
    reviews: 143,
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
    description:
      'Rio de Janeiro, often simply called Rio, is one of Brazil\'s most iconic cities, renowned for its stunning beaches, vibrant culture, and the spectacular Christ the Redeemer statue overlooking the city.',
    tours: [
      {
        id: 'iconic-brazil',
        name: 'Iconic Brazil',
        days: 8,
        price: 658,
        rating: 4.6,
        reviews: 56,
        image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=400&q=80',
      },
      {
        id: 'beach-escape',
        name: 'Beach Escape',
        days: 8,
        price: 490,
        rating: 4.8,
        reviews: 88,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
      },
      {
        id: 'amazon-adventure',
        name: 'Amazon Adventure',
        days: 12,
        price: 1200,
        rating: 4.9,
        reviews: 34,
        image: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=400&q=80',
      },
    ],
  },
  paris: {
    city: 'Paris',
    country: 'France',
    rating: 4.8,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description: 'Paris, the City of Light, is the capital of France and home to iconic landmarks like the Eiffel Tower and the Louvre. Famous for its cuisine, fashion, and art.',
    tours: [
      {
        id: 'paris-classic',
        name: 'Paris Classic',
        days: 5,
        price: 820,
        rating: 4.9,
        reviews: 102,
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80',
      },
    ],
  },
};

export default function DestinationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dest = DEST_DATA[id as string] || DEST_DATA.rio;
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: dest.image }} style={styles.heroImage} />

          {/* Header Buttons */}
          <View style={styles.heroButtons}>
            <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
              <ArrowLeft size={20} color="#181925" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLiked(!liked)} style={styles.circleBtn}>
              <Heart size={20} color={liked ? '#ff3e00' : '#181925'} fill={liked ? '#ff3e00' : 'none'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Row */}
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.cityName}>{dest.city}</Text>
              <View style={styles.locationRow}>
                <View style={styles.locationDot} />
                <Text style={styles.countryName}>{dest.country}</Text>
              </View>
            </View>
            <View style={styles.ratingBox}>
              <Star size={14} color="#ffa600" fill="#ffa600" />
              <Text style={styles.ratingText}>{dest.rating}</Text>
            </View>
          </View>

          <Text style={styles.reviewCount}>{dest.reviews} reviews</Text>

          {/* Description */}
          <Text style={styles.description} numberOfLines={3}>{dest.description}</Text>
          <TouchableOpacity>
            <Text style={styles.readMore}>Read more</Text>
          </TouchableOpacity>

          {/* Upcoming Tours */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming tours</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Tour Cards Horizontal */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tourScroll}>
            {dest.tours.map((tour: any) => (
              <TouchableOpacity
                key={tour.id}
                style={styles.tourCard}
                onPress={() => router.push(`/travel/tour/${tour.id}` as any)}
                activeOpacity={0.88}
              >
                <Image source={{ uri: tour.image }} style={styles.tourImage} />
                <TouchableOpacity style={styles.tourHeart}>
                  <Heart size={14} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.tourInfo}>
                  <Text style={styles.tourName}>{tour.name}</Text>
                  <Text style={styles.tourDays}>{tour.days} days · from ${tour.price}/person</Text>
                  <View style={styles.tourRatingRow}>
                    <Star size={11} color="#ffa600" fill="#ffa600" />
                    <Text style={styles.tourRating}>{tour.rating}</Text>
                    <Text style={styles.tourReviews}>{tour.reviews} reviews</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.tourArrowBtn}>
                  <Text style={styles.tourArrow}>›</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            <View style={{ width: 24 }} />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  heroWrap: { width, height: height * 0.45, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroButtons: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  content: { padding: 24, paddingTop: 20 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cityName: { fontSize: 28, fontWeight: '700', color: '#181925', letterSpacing: -0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  locationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#33c758' },
  countryName: { fontSize: 14, color: '#666666', fontWeight: '500' },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: { fontSize: 14, fontWeight: '700', color: '#181925' },
  reviewCount: { fontSize: 13, color: '#999999', marginBottom: 16, marginTop: 2 },
  description: { fontSize: 14, lineHeight: 22, color: '#666666', marginBottom: 6 },
  readMore: { fontSize: 14, fontWeight: '600', color: '#181925', textDecorationLine: 'underline', marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#181925' },
  seeAll: { fontSize: 13, fontWeight: '600', color: '#999999' },
  tourScroll: { marginHorizontal: -24, paddingLeft: 24 },
  tourCard: {
    width: 200,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tourImage: { width: '100%', height: 130 },
  tourHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tourInfo: { padding: 14, flex: 1 },
  tourName: { fontSize: 15, fontWeight: '700', color: '#181925', marginBottom: 4 },
  tourDays: { fontSize: 12, color: '#999999', marginBottom: 8 },
  tourRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  tourRating: { fontSize: 12, fontWeight: '700', color: '#181925' },
  tourReviews: { fontSize: 12, color: '#999999', marginLeft: 2 },
  tourArrowBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#918df6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tourArrow: { color: '#FFFFFF', fontSize: 18, lineHeight: 22 },
});
