import { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Checkbox,
  HelperText,
  Text,
  TextInput,
  RadioButton,
} from 'react-native-paper';
import { Controller } from 'react-hook-form';
import type { StepFormFieldProps } from '../types';
import { MaterialIcons } from '@expo/vector-icons';
// AJOUTÉ : Import pour la sélection de fichiers
//import * as DocumentPicker from 'expo-document-picker';

// ── FileField (Composant interne pour le type file) ───────────────────────────────
// AJOUTÉ : Nouveau composant pour gérer la sélection de documents
/*function FileField({
  label,
  value,
  onChange,
  error,
  disabled,
}: {
  label: string;
  value: any;
  onChange: (val: any) => void;
  error?: boolean;
  disabled?: boolean;
}) {
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        onChange(result.assets[0]);
      }
    } catch (err) {
      console.error("Erreur lors de la sélection du fichier:", err);
    }
  };

  return (
    <View style={fileStyles.container}>
      <Text style={[fileStyles.label, error && fileStyles.labelError]}>{label}</Text>
      
      <View style={[
        fileStyles.dropZone,
        error ? fileStyles.dropZoneError : fileStyles.dropZoneDefault,
        disabled && fileStyles.disabled
      ]}>
        {!value ? (
          <TouchableOpacity 
            style={fileStyles.innerBtn} 
            onPress={handlePickDocument}
            disabled={disabled}
          >
            <MaterialIcons name="cloud-upload" size={28} color={disabled ? "#ccc" : "#6200ee"} />
            <Text style={fileStyles.placeholder}>Cliquez pour choisir un fichier</Text>
          </TouchableOpacity>
        ) : (
          <View style={fileStyles.fileInfoRow}>
            <MaterialIcons name="insert-drive-file" size={24} color="#6200ee" />
            <View style={fileStyles.textContainer}>
              <Text numberOfLines={1} style={fileStyles.fileName}>{value.name}</Text>
              {value.size && (
                <Text style={fileStyles.fileSize}>
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              )}
            </View>
            <IconButton 
              icon="close" 
              size={20} 
              onPress={() => onChange(null)} 
              disabled={disabled}
            />
          </View>
        )}
      </View>
    </View>
  );
}*/

// ── RadioField (Composant interne pour le type radio) ───────────────────────────────
// AJOUTÉ : Nouveau composant pour gérer l'affichage des boutons radio
function RadioField({
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

// ── SelectField (bottom sheet natif, sans Menu, pour gerer le select avec react-hook-form) ───────────────────────────────
function SelectField({
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

// ── StepFormField ─────────────────────────────────────────────────────────────
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
              ) : (
                <TextInput
                  //label={label}
                  // AJOUTÉ : Affichage du compteur si une limite existe
                  label={
                    limit
                      ? `${label} (${(value ?? '').length}/${limit})`
                      : label
                  }
                  onBlur={onBlur}
                  //onChangeText={onChange}
                  onChangeText={handleTextChange} // MODIFIÉ
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
                  maxLength={limit} // securiter
                  left={LeftIcon?.()}
                  right={
                    isSecureField ? (
                      <TextInput.Icon
                        //icon={() => inputProps?.right}
                        //onPress={() => setSecureTextVisible((p) => !p)}
                        icon={secureTextVisible ? 'eye-off' : 'eye'} // MODIFIÉ pour icône dynamique
                        onPress={() => setSecureTextVisible((p) => !p)}
                        forceTextInputFocus={false}
                      />
                    ) : (
                      RightIcon?.()
                    )
                  }
                  style={styles.input}
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

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  input: { backgroundColor: 'transparent' },
});

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

// AJOUTÉ : Styles pour le composant FileField
// AJOUTÉ : Styles pour le composant FileField
/*const fileStyles = StyleSheet.create({
  container: { marginBottom: 8 },
  label: { fontSize: 12, color: '#6200ee', marginBottom: 4, fontWeight: '500', marginLeft: 4 },
  labelError: { color: '#B00020' },
  dropZone: {
    borderWidth: 1.5,
    borderRadius: 8,
    borderStyle: 'dashed',
    minHeight: 64,
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  dropZoneDefault: { borderColor: '#9E9E9E' },
  dropZoneError: { borderColor: '#B00020', backgroundColor: '#fff8f8' },
  innerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12 },
  placeholder: { marginLeft: 10, color: '#757575', fontSize: 14 },
  fileInfoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  textContainer: { flex: 1, marginLeft: 12 },
  fileName: { fontSize: 14, color: '#212121', fontWeight: '500' },
  fileSize: { fontSize: 11, color: '#757575' },
  disabled: { opacity: 0.5 },
});*/
