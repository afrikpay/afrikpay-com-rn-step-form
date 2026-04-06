import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  StyleSheet,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { Eye, EyeOff, Check } from 'lucide-react-native';
import type { StepFormFieldProps } from '../types';
import { colors } from '../tokens';
import { DateFieldNW } from './fields/DateFieldNW';
import { SelectFieldNW } from './fields/SelectFieldNW';
import { FileFieldNW } from './fields/FileFieldNW';

export function StepFormField({
  field,
  control,
  error,
  defaultValue,
  formValues,
}: StepFormFieldProps) {
  const [secureTextVisible, setSecureTextVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const {
    name,
    label,
    type,
    placeholder,
    validation,
    disabled,
    maxLength,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    options,
    editable: editableFn,
  } = field;

  const isEditable = editableFn ? editableFn(formValues ?? {}) : !disabled;

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address' as const;
      case 'phone':
        return 'phone-pad' as const;
      case 'number':
        return 'numeric' as const;
      default:
        return 'default' as const;
    }
  };

  const isSecureField = type === 'password';
  const isMultiline = type === 'multiline';
  const testID = `step-form-field-${name}`;

  const renderLabel = (currentLength?: number) => (
    <Text style={f.label}>
      {label}
      {maxLength != null && currentLength !== undefined && (
        <Text style={f.counter}>
          {' '}
          ({currentLength}/{maxLength})
        </Text>
      )}
    </Text>
  );

  return (
    <View style={f.container} testID={testID}>
      <Controller
        control={control}
        name={name}
        rules={validation}
        defaultValue={defaultValue}
        shouldUnregister={false} //permet de forcer la validation des champs
        render={({ field: { onChange, onBlur, value } }) => {
          if (type === 'date') {
            return (
              <DateFieldNW
                label={label}
                value={value}
                onChange={onChange}
                error={error?.message!.toString()}
                disabled={!isEditable}
                leftIcon={LeftIcon}
                testID={testID}
              />
            );
          }
          if (type === 'select') {
            return (
              <SelectFieldNW
                label={label}
                value={value}
                options={options ?? []}
                onChange={onChange}
                error={error?.message!.toString()}
                disabled={!isEditable}
                testID={testID}
                placeholder={placeholder}
              />
            );
          }
          if (type === 'file') {
            return (
              <FileFieldNW
                label={label}
                value={value}
                onChange={onChange}
                error={error?.message?.toString()}
                disabled={!isEditable}
                testID={testID}
              />
            );
          }

          // Radio
          if (type === 'radio') {
            return (
              <View>
                {renderLabel()}
                {(options ?? []).map((opt) => (
                  <Pressable
                    key={opt.value}
                    testID={`${testID}-radio-${opt.value}`}
                    onPress={() => onChange(opt.value)}
                    style={[
                      f.radioRow,
                      value === opt.value ? f.radioSelected : f.radioDefault,
                    ]}
                  >
                    <View
                      style={[
                        f.radioDot,
                        value === opt.value ? f.radioDotOn : f.radioDotOff,
                      ]}
                    >
                      {value === opt.value && <View style={f.radioDotInner} />}
                    </View>
                    <Text style={f.radioLabel}>{opt.label}</Text>
                  </Pressable>
                ))}
                {error && (
                  <Text style={f.errorText}>{error.message?.toString()}</Text>
                )}
              </View>
            );
          }

          // Switch
          if (type === 'switch') {
            return (
              <Pressable
                testID={`${testID}-switch`}
                onPress={() => onChange(!value)}
                style={f.switchRow}
              >
                <Text style={f.switchLabel}>{label}</Text>
                <Switch
                  value={!!value}
                  onValueChange={onChange}
                  trackColor={{
                    false: colors.neutral200,
                    true: colors.primary700,
                  }}
                  thumbColor={colors.white}
                />
              </Pressable>
            );
          }

          // Checkbox
          if (type === 'checkbox') {
            return (
              <Pressable
                testID={`${testID}-checkbox`}
                onPress={() => onChange(!value)}
                style={f.checkboxRow}
              >
                <View
                  style={[f.checkboxBox, value ? f.checkboxOn : f.checkboxOff]}
                >
                  {value && <Check size={14} color={colors.white} />}
                </View>
                <Text style={f.checkboxLabel}>{label}</Text>
              </Pressable>
            );
          }

          // Text-based fields
          const currentLength = typeof value === 'string' ? value.length : 0;

          return (
            <View>
              {renderLabel(maxLength != null ? currentLength : undefined)}
              <View style={f.inputRow}>
                {LeftIcon && (
                  <View style={f.leftIconWrap}>
                    <LeftIcon size={20} color={colors.neutral400} />
                  </View>
                )}
                <TextInput
                  testID={`${testID}-input`}
                  placeholder={placeholder}
                  value={value?.toString() ?? ''}
                  onChangeText={(text) => {
                    // Vérifier le maxLength pour bloquer la saisie
                    const effectiveMaxLength =
                      maxLength ||
                      (typeof validation?.maxLength === 'object'
                        ? validation.maxLength.value
                        : validation?.maxLength);

                    if (
                      effectiveMaxLength &&
                      text.length > effectiveMaxLength
                    ) {
                      return; // Bloquer la saisie si la limite est dépassée
                    }

                    if (type === 'number' || type === 'phone') {
                      onChange(text.replace(/[^0-9]/g, ''));
                    } else {
                      onChange(text);
                    }
                  }}
                  onBlur={() => {
                    setIsFocused(false);
                    onBlur();
                  }}
                  onFocus={() => setIsFocused(true)}
                  secureTextEntry={isSecureField && !secureTextVisible}
                  keyboardType={getKeyboardType()}
                  editable={isEditable}
                  multiline={isMultiline}
                  numberOfLines={isMultiline ? 4 : 1}
                  maxLength={maxLength}
                  autoCapitalize={type === 'email' ? 'none' : 'sentences'}
                  autoComplete={type === 'email' ? 'email' : 'off'}
                  autoCorrect={false}
                  placeholderTextColor={colors.neutral400}
                  style={[
                    f.textInput,
                    error
                      ? f.borderError
                      : isFocused
                        ? f.borderFocus
                        : f.borderDefault,
                    LeftIcon && f.textInputWithLeftIcon,
                    (isSecureField || RightIcon) && f.textInputWithRightIcon,
                    !isEditable && f.inputDisabled,
                    isMultiline && f.inputMultiline,
                  ]}
                />
                {isSecureField && (
                  <Pressable
                    style={f.rightIconWrap}
                    onPress={() => setSecureTextVisible(!secureTextVisible)}
                    testID={`${testID}-toggle-password`}
                  >
                    {secureTextVisible ? (
                      <Eye size={20} color={colors.neutral400} />
                    ) : (
                      <EyeOff size={20} color={colors.neutral400} />
                    )}
                  </Pressable>
                )}
                {!isSecureField && RightIcon && (
                  <View style={f.rightIconWrap}>
                    <RightIcon size={20} color={colors.neutral400} />
                  </View>
                )}
              </View>
              {error && (
                <Text style={f.errorText}>{error.message?.toString()}</Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const f = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral700,
  },
  counter: { color: colors.neutral400 },
  errorText: { marginTop: 4, fontSize: 14, color: colors.error500 },
  // Text input
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.neutral900,
    minHeight: 44,
  },
  textInputWithLeftIcon: { paddingLeft: 40 },
  textInputWithRightIcon: { paddingRight: 40 },
  borderDefault: { borderColor: colors.neutral300 },
  borderFocus: { borderColor: colors.primary700 },
  borderError: { borderColor: colors.error500 },
  inputDisabled: {
    backgroundColor: colors.neutral100,
    color: colors.neutral400,
  },
  inputMultiline: { minHeight: 100, textAlignVertical: 'top' },
  leftIconWrap: { position: 'absolute', left: 12, zIndex: 1 },
  rightIconWrap: { position: 'absolute', right: 12 },
  // Radio
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    marginBottom: 8,
  },
  radioDefault: { borderColor: colors.neutral200 },
  radioSelected: {
    borderColor: colors.primary700,
    backgroundColor: colors.primary50,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioDotOn: {
    borderColor: colors.primary700,
    backgroundColor: colors.primary700,
  },
  radioDotOff: { borderColor: colors.neutral300 },
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  radioLabel: { fontSize: 16, color: colors.neutral900 },
  // Switch
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  switchLabel: { flex: 1, fontSize: 16, color: colors.neutral900 },
  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: colors.primary700,
    borderColor: colors.primary700,
  },
  checkboxOff: { borderColor: colors.neutral300 },
  checkboxLabel: { flex: 1, fontSize: 16, color: colors.neutral900 },
});
