// ── RadioField (Composant interne pour le type radio) ───────────────────────────────

/*import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
});*/

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.groupLabel}>{label}</Text>

      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => !disabled && onChange(option.value)}
            style={styles.radioOption}
            activeOpacity={0.7}
          >
            {/* Cercle radio */}
            <View
              style={[
                styles.radioOuter,
                isSelected && styles.radioOuterSelected,
                disabled && styles.disabled,
              ]}
            >
              {isSelected && <View style={styles.radioInner} />}
            </View>

            {/* Label */}
            <Text style={[styles.optionLabel, disabled && styles.disabled]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },

  groupLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },

  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingVertical: 4,
  },

  optionLabel: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 10,
  },

  // Cercle externe
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6200ee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuterSelected: {
    borderColor: '#6200ee',
  },

  // Cercle interne (quand sélectionné)
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6200ee',
  },

  disabled: {
    opacity: 0.5,
  },
});
