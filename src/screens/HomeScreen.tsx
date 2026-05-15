import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import Colors from '../constants/colors';
import { recommendedGames, trendingGames, gameTags } from '../constants/data';
import LogoIcon from '../components/LogoIcon';
import SearchBar from '../components/SearchBar';
import SectionTitle from '../components/SectionTitle';
import GameCardHorizontal from '../components/GameCardHorizontal';

export default function HomeScreen({ navigation }: any) {
  const [search, setSearch]         = useState('');
  const [tagsVisible, setTagsVisible] = useState(false);
  const [activeTag, setActiveTag]   = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.BG_PRIMARY} />

      {/* Header */}
      <View style={styles.header}>
        <LogoIcon size={42} />
        <SearchBar value={search} onChangeText={setSearch} />
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recomendações */}
        <View style={styles.section}>
          <SectionTitle title="Recomendações" subtitle="Com base no seu histórico.." />
          <FlatList
            horizontal
            data={recommendedGames}
            keyExtractor={(g) => g.id}
            contentContainerStyle={styles.carousel}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <GameCardHorizontal game={item} onWant={() => {}} />
            )}
          />
        </View>

        {/* Em Alta */}
        <View style={styles.section}>
          <SectionTitle title="Em Alta" subtitle="Tá na boca do povo!" />
          <FlatList
            horizontal
            data={trendingGames}
            keyExtractor={(g) => g.id}
            contentContainerStyle={styles.carousel}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <GameCardHorizontal game={item} />}
          />
        </View>

        {/* Tags button */}
        <View style={styles.tagsArea}>
          <TouchableOpacity style={styles.tagsBtn} onPress={() => setTagsVisible(true)}>
            <Text style={styles.tagsBtnText}>Tags</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Tags Modal */}
      <Modal
        visible={tagsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTagsVisible(false)}
        statusBarTranslucent
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setTagsVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Filtrar por Tags</Text>
            <View style={styles.tagsGrid}>
              {gameTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagChip, activeTag === tag && styles.tagChipActive]}
                  onPress={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  <Text style={[styles.tagChipText, activeTag === tag && styles.tagChipTextActive]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setTagsVisible(false)}>
              <Text style={styles.modalCloseBtnText}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: Colors.BG_PRIMARY },
  header:             { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  profileBtn:         { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.BG_CARD, borderWidth: 1.5, borderColor: Colors.BORDER, justifyContent: 'center', alignItems: 'center' },
  profileIcon:        { fontSize: 16 },
  section:            { marginTop: 20 },
  carousel:           { paddingLeft: 16, paddingRight: 8 },
  tagsArea:           { marginTop: 20, alignItems: 'center' },
  tagsBtn:            { borderWidth: 1.5, borderColor: Colors.ACCENT, borderRadius: 20, paddingHorizontal: 28, paddingVertical: 8 },
  tagsBtnText:        { color: Colors.ACCENT, fontWeight: '600', fontSize: 14 },
  modalBackdrop:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet:         { backgroundColor: Colors.BG_MODAL, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, paddingBottom: 36, borderTopWidth: 1, borderColor: Colors.BORDER },
  modalHandle:        { width: 40, height: 4, backgroundColor: Colors.BORDER_LIGHT, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle:         { color: Colors.TEXT_PRIMARY, fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  tagsGrid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 20 },
  tagChip:            { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, backgroundColor: Colors.BG_CARD, borderWidth: 1, borderColor: Colors.BORDER },
  tagChipActive:      { backgroundColor: Colors.ACCENT, borderColor: Colors.ACCENT },
  tagChipText:        { color: Colors.TEXT_SECONDARY, fontSize: 13, fontWeight: '500' },
  tagChipTextActive:  { color: Colors.BG_PRIMARY, fontWeight: '700' },
  modalCloseBtn:      { paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: Colors.BORDER, alignItems: 'center' },
  modalCloseBtnText:  { color: Colors.TEXT_MUTED, fontSize: 15 },
});
