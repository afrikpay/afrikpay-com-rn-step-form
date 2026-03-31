import { useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '../../tokens';

type DateFieldNWProps = {
  label: string;
  value?: Date | string;
  onChange: (date: Date) => void;
  error?: string;
  disabled?: boolean;
  leftIcon?: LucideIcon;
  testID?: string;
};

export function DateFieldNW({
  label,
  value,
  onChange,
  error,
  disabled = false,
  leftIcon: LeftIcon,
  testID,
}: DateFieldNWProps) {
  const [showPicker, setShowPicker] = useState(false);
  const Icon = LeftIcon ?? Calendar;

  const dateValue =
    value instanceof Date ? value : value ? new Date(value) : undefined;

  const formattedDate = dateValue ? dateValue.toLocaleDateString('fr-FR') : '';

  const handleChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View testID={testID}>
      <Text style={s.label}>{label}</Text>
      <Pressable
        testID={`${testID}-trigger`}
        onPress={() => !disabled && setShowPicker(true)}
        style={[
          s.trigger,
          error ? s.borderError : s.borderDefault,
          disabled && s.bgDisabled,
        ]}
      >
        <View style={s.iconWrap}>
          <Icon size={20} color={colors.neutral400} />
        </View>
        <Text style={[s.valueText, !formattedDate && s.placeholderText]}>
          {formattedDate || 'JJ/MM/AAAA'}
        </Text>
      </Pressable>

      {showPicker && (
        <View>
          <DateTimePicker
            testID={`${testID}-picker`}
            value={dateValue ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
            maximumDate={new Date()}
            locale="fr-FR"
          />
          {Platform.OS === 'ios' && (
            <Pressable
              onPress={() => setShowPicker(false)}
              style={s.iosConfirm}
            >
              <Text style={s.iosConfirmText}>Confirmer</Text>
            </Pressable>
          )}
        </View>
      )}

      {error && <Text style={s.errorText}>{error}</Text>}
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
  iconWrap: { marginRight: 12 },
  valueText: { flex: 1, fontSize: 16, color: colors.neutral900 },
  placeholderText: { color: colors.neutral400 },
  iosConfirm: { alignItems: 'center', paddingVertical: 8, marginTop: 4 },
  iosConfirmText: { color: colors.primary700, fontWeight: '500' },
  errorText: { marginTop: 4, fontSize: 14, color: colors.error500 },
});
