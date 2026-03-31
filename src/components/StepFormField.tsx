import { useState } from 'react'
import { View, Text, TextInput, Pressable, Switch } from 'react-native'
import { Controller } from 'react-hook-form'
import { Eye, EyeOff, Check, ChevronDown, Upload, X } from 'lucide-react-native'
import type { StepFormFieldProps } from '../types'
import { DateFieldNW } from './fields/DateFieldNW'
import { SelectFieldNW } from './fields/SelectFieldNW'
import { FileFieldNW } from './fields/FileFieldNW'

export function StepFormField({
  field,
  control,
  error,
  defaultValue,
  formValues,
}: StepFormFieldProps) {
  const [secureTextVisible, setSecureTextVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

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
  } = field

  const isEditable = editableFn ? editableFn(formValues ?? {}) : !disabled

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address' as const
      case 'phone':
        return 'phone-pad' as const
      case 'number':
        return 'numeric' as const
      default:
        return 'default' as const
    }
  }

  const isSecureField = type === 'password'
  const isMultiline = type === 'multiline'
  const testID = `step-form-field-${name}`

  const borderClass = error
    ? 'border-error-500'
    : isFocused
      ? 'border-primary-500'
      : 'border-neutral-300'

  const renderLabel = (currentLength?: number) => (
    <Text className="mb-2 text-sm font-medium text-neutral-700">
      {label}
      {maxLength && currentLength !== undefined && (
        <Text className="text-neutral-400"> ({currentLength}/{maxLength})</Text>
      )}
    </Text>
  )

  return (
    <View className="mb-4" testID={testID}>
      <Controller
        control={control}
        name={name}
        rules={validation}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value } }) => {
          // Date field
          if (type === 'date') {
            return (
              <DateFieldNW
                label={label}
                value={value}
                onChange={onChange}
                error={error?.message?.toString()}
                disabled={!isEditable}
                leftIcon={LeftIcon}
                testID={testID}
              />
            )
          }

          // Select field
          if (type === 'select') {
            return (
              <SelectFieldNW
                label={label}
                options={options ?? []}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                error={error?.message?.toString()}
                disabled={!isEditable}
                testID={testID}
              />
            )
          }

          // File field
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
            )
          }

          // Radio field
          if (type === 'radio') {
            return (
              <View>
                {renderLabel()}
                <View className="gap-2">
                  {(options ?? []).map((opt) => (
                    <Pressable
                      key={opt.value}
                      testID={`${testID}-radio-${opt.value}`}
                      onPress={() => onChange(opt.value)}
                      className={`flex-row items-center p-3 rounded-lg border min-h-[44px] ${
                        value === opt.value
                          ? 'border-primary-700 bg-primary-50'
                          : 'border-neutral-200'
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                          value === opt.value
                            ? 'border-primary-700 bg-primary-700'
                            : 'border-neutral-300'
                        }`}
                      >
                        {value === opt.value && (
                          <View className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </View>
                      <Text className="text-base text-neutral-900">
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {error && (
                  <Text className="mt-1 text-sm text-error-500">
                    {error.message?.toString()}
                  </Text>
                )}
              </View>
            )
          }

          // Switch field
          if (type === 'switch') {
            return (
              <Pressable
                testID={`${testID}-switch`}
                onPress={() => onChange(!value)}
                className="flex-row items-center justify-between py-3"
              >
                <Text className="text-base text-neutral-900 flex-1">
                  {label}
                </Text>
                <Switch
                  value={!!value}
                  onValueChange={onChange}
                  trackColor={{ false: '#E5E5E5', true: '#1D4ED8' }}
                  thumbColor="#FFFFFF"
                />
              </Pressable>
            )
          }

          // Checkbox field
          if (type === 'checkbox') {
            return (
              <Pressable
                testID={`${testID}-checkbox`}
                onPress={() => onChange(!value)}
                className="flex-row items-center gap-3 py-2"
              >
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    value
                      ? 'bg-primary-700 border-primary-700'
                      : 'border-neutral-300'
                  }`}
                >
                  {value && <Check size={14} color="#fff" />}
                </View>
                <Text className="text-base text-neutral-900 flex-1">
                  {label}
                </Text>
              </Pressable>
            )
          }

          // Text-based fields (text, email, password, number, phone, multiline)
          const currentLength = typeof value === 'string' ? value.length : 0

          return (
            <View>
              {renderLabel(maxLength ? currentLength : undefined)}
              <View className="flex-row items-center">
                {LeftIcon && (
                  <View className="absolute left-3 z-10">
                    <LeftIcon size={20} color="#A3A3A3" />
                  </View>
                )}
                <TextInput
                  testID={`${testID}-input`}
                  placeholder={placeholder}
                  value={value?.toString() ?? ''}
                  onChangeText={(text) => {
                    if (type === 'number' || type === 'phone') {
                      onChange(text.replace(/[^0-9]/g, ''))
                    } else {
                      onChange(text)
                    }
                  }}
                  onBlur={() => {
                    setIsFocused(false)
                    onBlur()
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
                  placeholderTextColor="#A3A3A3"
                  className={`flex-1 px-4 py-3 text-base bg-white border rounded-lg text-neutral-900 ${borderClass} ${
                    LeftIcon ? 'pl-10' : ''
                  } ${isSecureField || RightIcon ? 'pr-10' : ''} ${
                    !isEditable ? 'bg-neutral-100 text-neutral-400' : ''
                  } ${isMultiline ? 'min-h-[100px]' : 'min-h-[44px]'}`}
                />
                {isSecureField && (
                  <Pressable
                    className="absolute right-3"
                    onPress={() => setSecureTextVisible(!secureTextVisible)}
                    testID={`${testID}-toggle-password`}
                  >
                    {secureTextVisible ? (
                      <Eye size={20} color="#A3A3A3" />
                    ) : (
                      <EyeOff size={20} color="#A3A3A3" />
                    )}
                  </Pressable>
                )}
                {!isSecureField && RightIcon && (
                  <View className="absolute right-3">
                    <RightIcon size={20} color="#A3A3A3" />
                  </View>
                )}
              </View>
              {error && (
                <Text className="mt-1 text-sm text-error-500">
                  {error.message?.toString()}
                </Text>
              )}
            </View>
          )
        }}
      />
    </View>
  )
}
