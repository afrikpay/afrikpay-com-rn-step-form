// SelectField (bottom sheet natif, sans Menu, pour gerer le select avec react-hook-form)
import { StyleSheet } from 'react-native';
import { useState, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  TouchableOpacity,
  View,
  Text,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function SelectField({
  label,
  value,
  options = [],
  onChange,
  error,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (val: string) => void;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(500)).current;
  const selected = options.find((o) => o.value === value);

  const openSheet = () => {
    setVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const closeSheet = () => {
    const { height } = Dimensions.get('window');
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const handleSelect = (val: string) => {
    onChange(val);
    closeSheet();
  };

  return (
    <View>
      {/* Champ cliquable */}
      <TouchableOpacity
        onPress={() => !disabled && openSheet()}
        activeOpacity={0.7}
      >
        <View
          style={[
            sheetStyles.trigger,
            error ? sheetStyles.triggerError : sheetStyles.triggerDefault,
            disabled && sheetStyles.triggerDisabled,
          ]}
        >
          <Text
            style={[
              sheetStyles.floatingLabel,
              error && sheetStyles.floatingLabelError,
            ]}
          >
            {label}
          </Text>
          <View style={sheetStyles.triggerRow}>
            <Text
              style={[
                sheetStyles.triggerValue,
                !selected && sheetStyles.placeholderText,
              ]}
            >
              {selected?.label ?? placeholder ?? 'Sélectionner...'}
            </Text>
            <Text
              style={[sheetStyles.chevron, error && sheetStyles.chevronError]}
            >
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                style={{
                  transform: [{ rotate: visible ? '180deg' : '0deg' }],
                }}
              />
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
      >
        <TouchableOpacity
          style={sheetStyles.overlay}
          activeOpacity={1}
          onPress={closeSheet}
        />
        <Animated.View
          style={[
            sheetStyles.sheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Handle */}
          <View style={sheetStyles.handleContainer}>
            <View style={sheetStyles.handle} />
          </View>
          {/* Titre */}
          <Text style={sheetStyles.sheetTitle}>{label}</Text>
          {/* Options */}
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => {
              const isSelected = value === item.value;
              return (
                <TouchableOpacity
                  style={[
                    sheetStyles.optionItem,
                    isSelected && sheetStyles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      sheetStyles.optionText,
                      isSelected && sheetStyles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <MaterialIcons name="check" size={18} color="#0070ba" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </Animated.View>
      </Modal>
    </View>
  );
}

const sheetStyles = StyleSheet.create({
  trigger: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    minHeight: 56,
  },
  triggerDefault: { borderColor: '#9E9E9E' },
  triggerError: { borderColor: '#B00020' },
  triggerDisabled: { opacity: 0.5 },
  floatingLabel: {
    fontSize: 12,
    color: '#6200ee',
    marginBottom: 2,
    fontWeight: '500',
  },
  floatingLabelError: { color: '#B00020' },
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerValue: { fontSize: 16, color: '#212121', flex: 1 },
  placeholderText: { color: '#9E9E9E' },
  chevron: { fontSize: 11, color: '#6200ee', marginLeft: 8 },
  chevronError: { color: '#B00020' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
    maxHeight: '60%',
  },
  handleContainer: { alignItems: 'center', paddingVertical: 12 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0' },
  sheetTitle: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#F0F0F0',
  },
  optionSelected: { backgroundColor: '#F3F0FF' },
  optionText: { fontSize: 16, color: '#212121' },
  optionTextSelected: {
    color: '#6200ee',
    fontWeight: '500',
  },
});
