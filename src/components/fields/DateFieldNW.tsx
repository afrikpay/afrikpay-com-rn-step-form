import { useState } from 'react'
import { View, Text, Pressable, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Calendar } from 'lucide-react-native'
import type { LucideIcon } from 'lucide-react-native'

type DateFieldNWProps = {
  label: string
  value?: Date | string
  onChange: (date: Date) => void
  error?: string
  disabled?: boolean
  leftIcon?: LucideIcon
  testID?: string
}

export function DateFieldNW({
  label,
  value,
  onChange,
  error,
  disabled = false,
  leftIcon: LeftIcon,
  testID,
}: DateFieldNWProps) {
  const [showPicker, setShowPicker] = useState(false)
  const Icon = LeftIcon ?? Calendar

  const dateValue = value instanceof Date ? value : value ? new Date(value) : undefined

  const formattedDate = dateValue
    ? dateValue.toLocaleDateString('fr-FR')
    : ''

  const handleChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false)
    }
    if (selectedDate) {
      onChange(selectedDate)
    }
  }

  const handleConfirmIOS = () => {
    setShowPicker(false)
  }

  return (
    <View testID={testID}>
      <Text className="mb-2 text-sm font-medium text-neutral-700">{label}</Text>
      <Pressable
        testID={`${testID}-trigger`}
        onPress={() => !disabled && setShowPicker(true)}
        className={`flex-row items-center px-4 py-3 bg-white border rounded-lg min-h-[44px] ${
          error
            ? 'border-error-500'
            : 'border-neutral-300'
        } ${disabled ? 'bg-neutral-100' : ''}`}
      >
        <View className="mr-3">
          <Icon size={20} color="#A3A3A3" />
        </View>
        <Text
          className={`text-base flex-1 ${
            formattedDate ? 'text-neutral-900' : 'text-neutral-400'
          }`}
        >
          {formattedDate || 'JJ/MM/AAAA'}
        </Text>
      </Pressable>

      {showPicker && (
        <View>
          <DateTimePicker
            testID={`${testID}-picker`}
            value={dateValue ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
            maximumDate={new Date()}
            locale="fr-FR"
          />
          {Platform.OS === 'ios' && (
            <Pressable
              onPress={handleConfirmIOS}
              className="items-center py-2 mt-1"
            >
              <Text className="text-primary-700 font-medium">Confirmer</Text>
            </Pressable>
          )}
        </View>
      )}

      {error && (
        <Text className="mt-1 text-sm text-error-500">{error}</Text>
      )}
    </View>
  )
}
