import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, HelperText, Text, TextInput } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import type { StepFormFieldProps } from '../types';

// import des champs personnalisés(composants)
import {
  SwitchField,
  DateField,
  FileField,
  RadioField,
  SelectField,
} from './fields';

export function StepFormField({
  field,
  control,
  error,
  defaultValue,
  //formValues,
}: StepFormFieldProps) {
  const [secureTextVisible, setSecureTextVisible] = useState(false);

  const {
    name,
    label,
    type,
    placeholder,
    validation,
    disabled,
    maxLength, // AJOUTÉ : Récupération du maxLength depuis la config
    options,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    inputProps,
  } = field;

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'phone':
        return 'phone-pad';
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  const isSecureField = type === 'password';
  // On vérifie si maxLength est un objet ou un nombre pour éviter l'erreur TS
  const validationLimit =
    typeof validation?.maxLength === 'object'
      ? validation.maxLength.value
      : validation?.maxLength;

  const limit = maxLength ?? validationLimit;

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={validation}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value } }) => {
          // AJOUTÉ : Gestion du changement de texte pour filtrer et limiter
          const handleTextChange = (text: string) => {
            let transformedText = text;

            // 1. Filtrage pour types numériques
            if (type === 'number' || type === 'phone') {
              transformedText = text.replace(/[^0-9]/g, '');
            }

            // 2. Application de la limite de longueur
            if (limit && transformedText.length > limit) {
              return; // On ignore la saisie
            }

            onChange(transformedText);
          };

          return (
            <>
              {type === 'checkbox' ? (
                <View style={styles.checkboxContainer}>
                  <Text variant="bodyMedium">{label}</Text>
                  <Checkbox
                    onPress={() => onChange(!value)}
                    status={value ? 'checked' : 'unchecked'}
                  />
                </View>
              ) : type === 'select' ? (
                <SelectField
                  label={label}
                  value={value}
                  options={options ?? []}
                  onChange={onChange}
                  error={!!error}
                  disabled={disabled}
                  placeholder={placeholder}
                />
              ) : type === 'radio' ? (
                // AJOUTÉ : Gestion du type radio dans le switch de rendu
                <RadioField
                  label={label}
                  value={value}
                  options={options ?? []}
                  onChange={onChange}
                  disabled={disabled}
                />
              ) : type === 'switch' ? (
                <SwitchField
                  label={label}
                  value={value}
                  onChange={onChange}
                  disabled={disabled}
                />
              ) : type === 'file' ? (
                // AJOUTÉ : Intégration du type file dans le switch de rendu
                <FileField
                  label={label}
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  disabled={disabled}
                />
              ) : type === 'date' ? (
                // AJOUTÉ : Type Date
                <DateField
                  label={label}
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  disabled={disabled}
                />
              ) : (
                <TextInput
                  label={
                    limit
                      ? `${label} (${(value ?? '').length}/${limit})`
                      : label
                  }
                  onBlur={onBlur}
                  onChangeText={handleTextChange}
                  value={value}
                  error={!!error}
                  disabled={disabled}
                  mode="outlined"
                  placeholder={placeholder}
                  keyboardType={getKeyboardType()}
                  secureTextEntry={isSecureField && !secureTextVisible}
                  autoCapitalize={type === 'email' ? 'none' : 'sentences'}
                  autoComplete={type === 'email' ? 'email' : 'off'}
                  autoCorrect={false}
                  maxLength={limit}
                  // LOGIQUE MULTILINE AJOUTÉE ICI
                  multiline={type === 'multiline'}
                  numberOfLines={type === 'multiline' ? 4 : 1}
                  left={LeftIcon?.()}
                  right={
                    isSecureField ? (
                      <TextInput.Icon
                        icon={secureTextVisible ? 'eye-off' : 'eye'}
                        onPress={() => setSecureTextVisible((p) => !p)}
                        forceTextInputFocus={false}
                      />
                    ) : (
                      RightIcon?.()
                    )
                  }
                  // Style dynamique pour le multiline
                  style={[
                    styles.input,
                    type === 'multiline' && styles.inputMultiline,
                  ]}
                  theme={{ roundness: 8 }}
                  {...inputProps}
                />
              )}
              {error && (
                <HelperText type="error" visible={!!error}>
                  {error.message?.toString()}
                </HelperText>
              )}
            </>
          );
        }}
      />
    </View>
  );
}

// ── Styles
const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  input: { backgroundColor: 'transparent' },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top', // Pour que le texte commence en haut sur Android
  },
});
