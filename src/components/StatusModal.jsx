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
import Colors from '../constants/colors';
import { STATUS_OPTIONS } from '../constants/data';

export default function StatusModal({ visible, game, currentStatus, onClose, onSelect }) {
  if (!game) return null;

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
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.BG_MODAL,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderColor: Colors.BORDER,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.BORDER_LIGHT,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.TEXT_MUTED,
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
    borderColor: Colors.BORDER,
    marginBottom: 8,
    backgroundColor: Colors.BG_CARD,
  },
  optionActive: {
    borderColor: Colors.ACCENT,
    backgroundColor: 'rgba(0,211,148,0.08)',
  },
  optionText: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 15,
  },
  optionTextActive: {
    color: Colors.ACCENT,
    fontWeight: '700',
  },
  checkmark: {
    color: Colors.ACCENT,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    marginTop: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.TEXT_MUTED,
    fontSize: 15,
  },
});
