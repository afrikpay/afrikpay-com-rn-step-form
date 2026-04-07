// ── SwitchField (Composant interne pour le type switch) ──────────────────────────
/*import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
};

export function SwitchField({ label, value, onChange, disabled }: Props) {
  return (
    <View style={switchStyles.container}>
      <Text style={[switchStyles.label, disabled && switchStyles.disabled]}>
        {label}
      </Text>
      <Switch
        value={!!value}
        onValueChange={onChange}
        disabled={disabled}
        color="#6200ee"
      />
    </View>
  );
}

const switchStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Aligne le label à gauche et le switch à droite
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#212121',
    flex: 1, // Permet au texte de prendre l'espace restant
  },
  disabled: {
    opacity: 0.5,
  },
});*/

// suppression de react native paper
import { StyleSheet, Text, View, Switch } from 'react-native';

type Props = {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
};

export function SwitchField({ label, value, onChange, disabled }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, disabled && styles.disabled]}>{label}</Text>

      <Switch
        value={!!value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: '#ccc', true: '#6200ee' }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#212121',
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
