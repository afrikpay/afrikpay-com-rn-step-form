import DateTimePicker from '@react-native-community/datetimepicker';
//import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

export function DateField({
  label,
  value,
  onChange,
  error,
  disabled,
}: {
  label: string;
  value: any;
  onChange: (val: Date) => void;
  error?: boolean;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  const dateValue = value instanceof Date ? value : new Date();

  const formatDate = (date: any) => {
    if (!date || !(date instanceof Date)) return 'Sélectionner une date';
    return date.toLocaleDateString('fr-FR');
  };

  // Bon type : DateTimePickerChangeEvent
  const handleValueChange = (
    _event: DateTimePickerChangeEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === 'android') setShow(false);
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View style={dateStyles.container}>
      <TouchableOpacity
        onPress={() => !disabled && setShow(true)}
        activeOpacity={0.7}
      >
        <View
          style={[
            dateStyles.trigger,
            error ? dateStyles.triggerError : dateStyles.triggerDefault,
            disabled && dateStyles.disabled,
          ]}
        >
          <Text style={[dateStyles.label, error && dateStyles.labelError]}>
            {label}
          </Text>
          <View style={dateStyles.row}>
            <Text style={[dateStyles.value, !value && dateStyles.placeholder]}>
              {formatDate(value)}
            </Text>
            <MaterialIcons
              name="event"
              size={22}
              color={disabled ? '#ccc' : '#6200ee'}
            />
          </View>
        </View>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onValueChange={handleValueChange}
          onDismiss={() => setShow(false)}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

// pour la date
const dateStyles = StyleSheet.create({
  container: { marginBottom: 8 },
  trigger: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 56,
    justifyContent: 'center',
  },
  triggerDefault: { borderColor: '#9E9E9E' },
  triggerError: { borderColor: '#B00020' },
  label: { fontSize: 12, color: '#6200ee', fontWeight: '500', marginBottom: 2 },
  labelError: { color: '#B00020' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: { fontSize: 16, color: '#212121' },
  placeholder: { color: '#9E9E9E' },
  disabled: { opacity: 0.5 },
});
