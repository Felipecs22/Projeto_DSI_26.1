import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Colors from '../constants/colors';
import { allGames, STATUS_CONFIG } from '../constants/data';
import SectionTitle from '../components/SectionTitle';
import GameCard from '../components/GameCard';
import CategoryButton from '../components/CategoryButton';
import GameStatusButton from '../components/GameStatusButton';
import StatusModal from '../components/StatusModal';

const FILTERS = [
  { id: 'todos',      label: 'Todos'      },
  { id: 'jogados',    label: 'Concluídos' },
  { id: 'jogando',    label: 'Jogando'    },
  { id: 'pausados',   label: 'Pausados'   },
  { id: 'abandonados',label: 'Abandonados'},
  { id: 'fila',       label: 'Na Fila'   },
];

const SECTION_TITLES: Record<string, string> = {
  todos:       'Sua Biblioteca',
  jogados:     'Concluídos',
  jogando:     'Jogando',
  pausados:    'Pausados',
  abandonados: 'Abandonados',
  fila:        'Na Fila',
};

export default function MyGamesScreen() {
  const [filter, setFilter]         = useState('todos');
  const [library, setLibrary]       = useState(allGames);
  const [selectedGame, setSelectedGame] = useState<any>(null);

  const filtered =
    filter === 'todos' ? library : library.filter((g) => g.status === filter);

  const handleStatusChange = (gameId: string, newStatus: string) => {
    setLibrary((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, status: newStatus } : g))
    );
  };

  const cfg = (STATUS_CONFIG as any)[filter];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.BG_PRIMARY} />

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{SECTION_TITLES[filter]}</Text>
          {cfg && <Text style={styles.sectionSubtitle}>{cfg.subtitle}</Text>}
        </View>
        <GameStatusButton label="Status" onPress={() => {}} />
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <CategoryButton
            key={f.id}
            label={f.label}
            active={filter === f.id}
            onPress={() => setFilter(f.id)}
          />
        ))}
      </ScrollView>

      {/* Game grid */}
      <FlatList
        data={filtered}
        keyExtractor={(g) => g.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎮</Text>
            <Text style={styles.emptyText}>Nenhum jogo nesta categoria.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <GameCard
            game={item}
            onPress={() => setSelectedGame(item)}
          />
        )}
      />

      {/* Status modal */}
      <StatusModal
        visible={!!selectedGame}
        game={selectedGame}
        currentStatus={selectedGame?.status}
        onClose={() => setSelectedGame(null)}
        onSelect={(newStatus: string) => {
          if (selectedGame) handleStatusChange(selectedGame.id, newStatus);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_PRIMARY,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 22,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: Colors.ACCENT,
    fontSize: 12,
    marginTop: 2,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  grid: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    color: Colors.TEXT_MUTED,
    fontSize: 15,
  },
});
