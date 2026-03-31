import { View, Text, Pressable } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { Upload, X, FileText } from 'lucide-react-native'

type FileFieldNWProps = {
  label: string
  value?: DocumentPicker.DocumentPickerAsset
  onChange: (file: DocumentPicker.DocumentPickerAsset | null) => void
  error?: string
  disabled?: boolean
  testID?: string
}

function formatFileSize(bytes: number | undefined): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export function FileFieldNW({
  label,
  value,
  onChange,
  error,
  disabled = false,
  testID,
}: FileFieldNWProps) {
  const handlePick = async () => {
    if (disabled) return
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf', 'application/msword', 'text/plain'],
      copyToCacheDirectory: true,
    })

    if (!result.canceled && result.assets?.[0]) {
      onChange(result.assets[0])
    }
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <View testID={testID}>
      <Text className="mb-2 text-sm font-medium text-neutral-700">{label}</Text>

      {value ? (
        <View className="flex-row items-center p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <FileText size={24} color="#6B7280" />
          <View className="flex-1 ml-3">
            <Text className="text-sm font-medium text-neutral-900" numberOfLines={1}>
              {value.name}
            </Text>
            {value.size && (
              <Text className="text-xs text-neutral-500">
                {formatFileSize(value.size)}
              </Text>
            )}
          </View>
          <Pressable
            testID={`${testID}-remove`}
            onPress={handleRemove}
            className="p-1"
          >
            <X size={20} color="#EF4444" />
          </Pressable>
        </View>
      ) : (
        <Pressable
          testID={`${testID}-pick`}
          onPress={handlePick}
          className={`items-center justify-center p-6 border border-dashed rounded-lg ${
            error ? 'border-error-500 bg-error-50' : 'border-neutral-300 bg-neutral-50'
          } ${disabled ? 'opacity-50' : ''}`}
        >
          <Upload size={24} color={error ? '#EF4444' : '#A3A3A3'} />
          <Text className={`mt-2 text-sm ${error ? 'text-error-500' : 'text-neutral-500'}`}>
            Appuyer pour choisir un fichier
          </Text>
          <Text className="mt-1 text-xs text-neutral-400">
            PDF, Image, Word, Texte
          </Text>
        </Pressable>
      )}

      {error && !value && (
        <Text className="mt-1 text-sm text-error-500">{error}</Text>
      )}
    </View>
  )
}
