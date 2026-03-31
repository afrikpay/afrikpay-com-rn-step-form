import { useCallback, useMemo, useRef } from 'react'
import { View, Text, Pressable } from 'react-native'
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { ChevronDown, Check } from 'lucide-react-native'

type SelectOption = { label: string; value: string }

type SelectFieldNWProps = {
  label: string
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  testID?: string
}

export function SelectFieldNW({
  label,
  options,
  value,
  onChange,
  placeholder = 'Sélectionner',
  error,
  disabled = false,
  testID,
}: SelectFieldNWProps) {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['50%'], [])
  const selectedOption = options.find((opt) => opt.value === value)

  const handleOpen = useCallback(() => {
    if (!disabled) bottomSheetRef.current?.expand()
  }, [disabled])

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue)
      bottomSheetRef.current?.close()
    },
    [onChange]
  )

  const renderItem = useCallback(
    ({ item }: { item: SelectOption }) => (
      <Pressable
        testID={`${testID}-option-${item.value}`}
        className={`flex-row items-center justify-between px-4 py-3 min-h-[44px] ${
          item.value === value ? 'bg-primary-50' : ''
        }`}
        onPress={() => handleSelect(item.value)}
      >
        <Text
          className={`text-base ${
            item.value === value
              ? 'text-primary-700 font-medium'
              : 'text-neutral-900'
          }`}
        >
          {item.label}
        </Text>
        {item.value === value && <Check size={20} color="#1D4ED8" />}
      </Pressable>
    ),
    [value, handleSelect, testID]
  )

  return (
    <View testID={testID}>
      <Text className="mb-2 text-sm font-medium text-neutral-700">{label}</Text>
      <Pressable
        testID={`${testID}-trigger`}
        onPress={handleOpen}
        className={`flex-row items-center justify-between px-4 py-3 bg-white border rounded-lg min-h-[44px] ${
          error ? 'border-error-500' : 'border-neutral-300'
        } ${disabled ? 'bg-neutral-100' : ''}`}
      >
        <Text
          className={`text-base ${
            selectedOption ? 'text-neutral-900' : 'text-neutral-400'
          }`}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDown size={20} color="#A3A3A3" />
      </Pressable>
      {error && (
        <Text className="mt-1 text-sm text-error-500">{error}</Text>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetFlatList
          data={options}
          keyExtractor={(item: SelectOption) => item.value}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </BottomSheet>
    </View>
  )
}
