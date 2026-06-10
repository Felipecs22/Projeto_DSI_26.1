import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { STATUS_OPTIONS } from '../constants/data';

const STATUS_ICON_MAP: Record<string, { icon: string; color: string; label: string }> = {
  jogando:     { icon: 'play-circle',   color: '#00d394', label: 'Jogando'      },
  jogados:     { icon: 'trophy',        color: '#f6ad55', label: 'Concluídos'   },
  pausados:    { icon: 'pause-circle',  color: '#63b3ed', label: 'Pausados'     },
  abandonados: { icon: 'close-circle',  color: '#fc8181', label: 'Abandonados'  },
  fila:        { icon: 'time',          color: '#94a3b8', label: 'Na Fila'      },
};

export default function StatusModal({ visible, game, currentStatus, onClose, onSelect, onRemove }) {
  if (!game) return null;
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {/* Handle */}
          <View style={styles.handle} />

          <Text style={styles.title} numberOfLines={1}>{game.name}</Text>
          <Text style={styles.subtitle}>Selecione o status deste jogo</Text>

          <ScrollView style={styles.options} showsVerticalScrollIndicator={false}>
            {STATUS_OPTIONS.map((opt) => {
              const meta = STATUS_ICON_MAP[opt.value];
              const isActive = currentStatus === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.option, isActive && styles.optionActive]}
                  onPress={() => { onSelect(opt.value); onClose(); }}
                >
                  <View style={styles.optionLeft}>
                    <Ionicons
                      name={meta?.icon ?? 'ellipse-outline'}
                      size={20}
                      color={isActive ? colors.ACCENT : (meta?.color ?? colors.TEXT_MUTED)}
                    />
                    <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                      {meta?.label ?? opt.label}
                    </Text>
                  </View>
                  {isActive && <Ionicons name="checkmark" size={18} color={colors.ACCENT} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          {currentStatus && onRemove ? (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => {
                onRemove();
                onClose();
              }}
            >
              <Text style={styles.removeText}>Remover da biblioteca</Text>
            </TouchableOpacity>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.SCRIM,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.BG_MODAL,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderColor: colors.BORDER,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.BORDER_LIGHT,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: colors.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.TEXT_MUTED,
    fontSize: 13,
    marginBottom: 16,
  },
  options: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER,
    marginBottom: 8,
    backgroundColor: colors.BG_CARD,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionActive: {
    borderColor: colors.ACCENT,
    backgroundColor: 'rgba(0,211,148,0.08)',
  },
  optionText: {
    color: colors.TEXT_SECONDARY,
    fontSize: 15,
  },
  optionTextActive: {
    color: colors.ACCENT,
    fontWeight: '700',
  },
  checkmark: {
    color: colors.ACCENT,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    marginTop: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.TEXT_MUTED,
    fontSize: 15,
  },
  removeBtn: {
    marginTop: 10,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.DANGER,
    alignItems: 'center',
  },
  removeText: {
    color: colors.DANGER,
    fontSize: 15,
    fontWeight: '600',
  },
});