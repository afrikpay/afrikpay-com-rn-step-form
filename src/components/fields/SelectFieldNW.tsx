/* import { useCallback, useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { ChevronDown, Check } from 'lucide-react-native';
import { colors } from '../../tokens';

type SelectOption = { label: string; value: string };

type SelectFieldNWProps = {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  testID?: string;
};

export function SelectFieldNW({
  label,
  options,
  value,
  onChange,
  placeholder = 'Sélectionner',
  error,
  disabled = false,
  testID,
}: SelectFieldNWProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);
  const selectedOption = options.find((opt) => opt.value === value);

  const handleOpen = useCallback(() => {
    if (!disabled) bottomSheetRef.current?.expand();
  }, [disabled]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      bottomSheetRef.current?.close();
    },
    [onChange]
  );

  const renderItem = useCallback(
    ({ item }: { item: SelectOption }) => (
      <Pressable
        testID={`${testID}-option-${item.value}`}
        style={[s.optionRow, item.value === value && s.optionSelected]}
        onPress={() => handleSelect(item.value)}
      >
        <Text
          style={[s.optionText, item.value === value && s.optionTextSelected]}
        >
          {item.label}
        </Text>
        {item.value === value && <Check size={20} color={colors.primary700} />}
      </Pressable>
    ),
    [value, handleSelect, testID]
  );

  return (
    <View testID={testID}>
      <Text style={s.label}>{label}</Text>
      <Pressable
        testID={`${testID}-trigger`}
        onPress={handleOpen}
        style={[
          s.trigger,
          error ? s.borderError : s.borderDefault,
          disabled && s.bgDisabled,
        ]}
      >
        <Text style={[s.valueText, !selectedOption && s.placeholderText]}>
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDown size={20} color={colors.neutral400} />
      </Pressable>
      {error && <Text style={s.errorText}>{error}</Text>}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetFlatList
          data={options}
          keyExtractor={(item: SelectOption) => item.value}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </BottomSheet>
    </View>
  );
}

const s = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral700,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
  },
  borderDefault: { borderColor: colors.neutral300 },
  borderError: { borderColor: colors.error500 },
  bgDisabled: { backgroundColor: colors.neutral100 },
  valueText: { fontSize: 16, color: colors.neutral900 },
  placeholderText: { color: colors.neutral400 },
  errorText: { marginTop: 4, fontSize: 14, color: colors.error500 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  optionSelected: { backgroundColor: colors.primary50 },
  optionText: { fontSize: 16, color: colors.neutral900 },
  optionTextSelected: { color: colors.primary700, fontWeight: '500' },
});
 */

// SelectFieldNW (bottom sheet natif, sans Menu, pour gerer le select avec react-hook-form)
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

export function SelectFieldNW({
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
  error?: boolean | string;
  disabled?: boolean;
  placeholder?: string;
  testID?: string;
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
              !!error && sheetStyles.floatingLabelError,
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
              style={[sheetStyles.chevron, !!error && sheetStyles.chevronError]}
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
