import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, HelperText, Text, TextInput } from 'react-native-paper';
import {
  Controller,
  type Control,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from 'react-hook-form';
import type { FormField } from '../types';

type StepFormFieldProps = {
  field: FormField;
  control: Control<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<FormData>>;
};

export function StepFormField({ field, control, error }: StepFormFieldProps) {
  const [secureTextVisible, setSecureTextVisible] = useState(false);

  const {
    name,
    label,
    type,
    placeholder,
    validation,
    disabled,
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

  const toggleSecureEntry = () => {
    setSecureTextVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={validation}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            {type === 'checkbox' ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <Text variant="bodyMedium">{label}</Text>
                <Checkbox onPress={onChange} status={value ? 'checked' : 'unchecked'} />
              </View>
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
                {error.message}
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
  input: {
    backgroundColor: 'transparent',
  },
});
