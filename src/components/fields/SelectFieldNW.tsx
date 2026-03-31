import { useCallback, useMemo, useRef } from 'react';
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
  const snapPoints = useMemo(() => ['50%'], []);
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
