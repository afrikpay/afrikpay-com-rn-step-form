/*import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox, HelperText, Menu, Text, TextInput } from 'react-native-paper';
import { Controller } from 'react-hook-form'; // pour connect les input aux formulaire
import type { StepFormFieldProps } from '../types';

// ── Composant Select ─────────────────────────────────────────────────────────
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
  const selected = options.find((o) => o.value === value);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <TouchableOpacity onPress={() => !disabled && setVisible(true)}>
          <TextInput
            label={label}
            value={selected?.label ?? ''}
            mode="outlined"
            editable={false}
            error={error}
            disabled={disabled}
            placeholder={placeholder}
            right={
              <TextInput.Icon
                icon="chevron-down"
                onPress={() => !disabled && setVisible(true)}
              />
            }
            style={styles.input}
            theme={{ roundness: 8 }}
            pointerEvents="none" // empêche le clavier de s'ouvrir
          />
        </TouchableOpacity>
      }
    >
      {options.map((option) => (
        <Menu.Item
          key={option.value}
          title={option.label}
          onPress={() => {
            onChange(option.value);
            setVisible(false);
          }}
        />
      ))}
    </Menu>
  );
}
// fin du composant Select

export function StepFormField({
  field,
  control,
  error,
  defaultValue,
  
}: StepFormFieldProps) {
  const [secureTextVisible, setSecureTextVisible] = useState(false);

  const {
    name,
    label,
    type,
    placeholder,
    validation,
    disabled,
    options,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    inputProps,
  } = field;

  const getKeyboardType = () => {
    // fonction pour adapter le clavier du telephones
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

  const toggleSecureEntry = () => {
    setSecureTextVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={validation}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value } }) => (
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
              /* ── CAS 2 : select ──────────────────────────────────────── 
              <SelectField
                label={label}
                value={value}
                options={options ?? []}
                onChange={onChange}
                error={!!error}
                placeholder={placeholder}
                disabled={disabled}
                
              />
            ) : (
              <TextInput
                label={label}
                onBlur={onBlur}
                onChangeText={onChange}
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
                left={LeftIcon?.()}
                right={
                  isSecureField ? (
                    <TextInput.Icon
                      icon={() => inputProps?.right}
                      onPress={toggleSecureEntry}
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
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  selectContainer: {
    flex: 1,
    gap: 16,
    backgroundColor: 'red',
  },
  input: {
    backgroundColor: 'transparent',
  },
});*/

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
import { Checkbox, HelperText, Text, TextInput } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import type { StepFormFieldProps } from '../types';

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
              ▼
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
                  {isSelected && <Text style={sheetStyles.checkmark}>✓</Text>}
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
}: StepFormFieldProps) {
  const [secureTextVisible, setSecureTextVisible] = useState(false);

  const {
    name,
    label,
    type,
    placeholder,
    validation,
    disabled,
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

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={validation}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value } }) => (
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
            ) : (
              <TextInput
                label={label}
                onBlur={onBlur}
                onChangeText={onChange}
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
                left={LeftIcon?.()}
                right={
                  isSecureField ? (
                    <TextInput.Icon
                      icon={() => inputProps?.right}
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
        )}
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
  optionTextSelected: { color: '#6200ee', fontWeight: '500' },
  checkmark: { color: '#6200ee', fontSize: 16, fontWeight: 'bold' },
});
