// ── RadioField (Composant interne pour le type radio) ───────────────────────────────

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RadioButton } from 'react-native-paper';

// AJOUTÉ : Nouveau composant pour gérer l'affichage des boutons radio
export function RadioField({
  label,
  value,
  options = [],
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  return (
    <View style={radioStyles.container}>
      <Text style={radioStyles.groupLabel}>{label}</Text>
      <RadioButton.Group onValueChange={onChange} value={value}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => !disabled && onChange(option.value)}
            style={radioStyles.radioOption}
            activeOpacity={0.6}
          >
            <RadioButton.Android
              value={option.value}
              disabled={disabled}
              color="#6200ee"
            />
            <Text
              style={[
                radioStyles.optionLabel,
                disabled && radioStyles.disabled,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </RadioButton.Group>
    </View>
  );
}

// AJOUTÉ : Styles pour le composant Radio
const radioStyles = StyleSheet.create({
  container: { marginBottom: 8 },
  groupLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    paddingVertical: 4,
  },
  optionLabel: { fontSize: 16, color: '#212121', marginLeft: 8 },
  disabled: {
    opacity: 0.5,
  },
});
