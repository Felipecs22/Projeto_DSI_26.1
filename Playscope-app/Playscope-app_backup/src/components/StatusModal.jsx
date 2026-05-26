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
import { useTheme } from '../context/ThemeContext';
import { STATUS_OPTIONS } from '../constants/data';

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
            {STATUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.option,
                  currentStatus === opt.value && styles.optionActive,
                ]}
                onPress={() => {
                  onSelect(opt.value);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    currentStatus === opt.value && styles.optionTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
                {currentStatus === opt.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
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
