import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Colors from '../constants/colors';
import { newsList } from '../constants/data';
import SectionTitle from '../components/SectionTitle';

const { width } = Dimensions.get('window');
const FEATURED_HEIGHT = (width - 32) * 0.55;

function FeaturedCard({ item }: { item: any }) {
  const [err, setErr] = React.useState(false);
  return (
    <TouchableOpacity style={styles.featuredCard} activeOpacity={0.85}>
      {item.image && !err ? (
        <Image
          source={{ uri: item.image }}
          style={styles.featuredImage}
          resizeMode="cover"
          onError={() => setErr(true)}
        />
      ) : (
        <View style={styles.featuredPlaceholder} />
      )}
      <View style={styles.featuredOverlay}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.featuredTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

function NewsCard({ item }: { item: any }) {
  const [err, setErr] = React.useState(false);
  const halfWidth = (width - 32 - 10) / 2;
  return (
    <TouchableOpacity style={[styles.newsCard, { width: halfWidth }]} activeOpacity={0.85}>
      <View style={styles.newsThumb}>
        {item.image && !err ? (
          <Image
            source={{ uri: item.image }}
            style={styles.newsImage}
            resizeMode="cover"
            onError={() => setErr(true)}
          />
        ) : (
          <View style={styles.newsPlaceholder}>
            <Text style={styles.newsPlaceholderText}>📰</Text>
          </View>
        )}
      </View>
      <View style={styles.newsInfo}>
        {item.category ? (
          <Text style={styles.newsCat}>{item.category}</Text>
        ) : null}
        <Text style={styles.newsTitle} numberOfLines={3}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NewsScreen() {
  const featured = newsList[0];
  const rest     = newsList.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.BG_PRIMARY} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <SectionTitle title="Últimas Notícias" />
        </View>

        {/* Featured */}
        <View style={styles.featuredWrapper}>
          <FeaturedCard item={featured} />
        </View>

        {/* Grid */}
        <View style={styles.newsGrid}>
          {rest.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_PRIMARY,
  },
  section: {
    marginTop: 16,
  },

  // Featured
  featuredWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  featuredCard: {
    borderRadius: 14,
    overflow: 'hidden',
    height: FEATURED_HEIGHT,
    backgroundColor: Colors.BG_CARD,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredPlaceholder: {
    flex: 1,
    backgroundColor: Colors.BG_CARD,
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: 'rgba(0,0,0,0)',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.ACCENT,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  categoryText: {
    color: Colors.BG_PRIMARY,
    fontSize: 11,
    fontWeight: '700',
  },
  featuredTitle: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },

  // News grid
  newsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
  },
  newsCard: {
    backgroundColor: Colors.BG_CARD,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  newsThumb: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: Colors.BG_INPUT,
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  newsPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsPlaceholderText: {
    fontSize: 28,
  },
  newsInfo: {
    padding: 10,
  },
  newsCat: {
    color: Colors.ACCENT,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newsTitle: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
});
