import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Upload, X, FileText } from 'lucide-react-native';
import { colors } from '../../tokens';

type FileFieldNWProps = {
  label: string;
  value?: DocumentPicker.DocumentPickerAsset;
  onChange: (file: DocumentPicker.DocumentPickerAsset | null) => void;
  error?: string;
  disabled?: boolean;
  testID?: string;
  placeholder?: string;
  acceptedTypes?: string[];
};

function formatFileSize(bytes: number | undefined): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatAcceptedTypes(types?: string[]): string {
  if (!types || types.length === 0) return 'PDF, Image, Word, Texte';

  const typeMap: { [key: string]: string } = {
    'application/pdf': 'PDF',
    'image/*': 'Image', // pour accepter tous les types d'image
    'image/jpeg': 'Image',
    'image/png': 'Image',
    'application/msword': 'Word', // pour accepter les documents Word
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'Word',
    'text/plain': 'Texte', // pour accepter les fichiers texte
  };

  const formattedTypes = types.map((type) => {
    // Vérifier les correspondances exactes d'abord
    if (typeMap[type]) return typeMap[type];
    // Vérifier les correspondances partielles (ex: image/*)
    for (const [key, value] of Object.entries(typeMap)) {
      if (key.includes('*') && type.startsWith(key.replace('*', ''))) {
        return value;
      }
    }
    // Retourner le type original si non trouvé
    return type.split('/').pop()?.toUpperCase() || type;
  });

  // Supprimer les doublons
  const uniqueTypes = [...new Set(formattedTypes)];
  return uniqueTypes.join(', ');
}

export function FileFieldNW({
  label,
  value,
  onChange,
  error,
  disabled = false,
  testID,
  placeholder,
  acceptedTypes,
}: FileFieldNWProps) {
  const handlePick = async () => {
    if (disabled) return;
    const result = await DocumentPicker.getDocumentAsync({
      type: acceptedTypes || [
        'image/*',
        'application/pdf',
        'application/msword',
        'text/plain',
      ],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      onChange(result.assets[0]);
    }
  };

  return (
    <View testID={testID}>
      <Text style={s.label}>{label}</Text>

      {value ? (
        <View style={s.filePreview}>
          <FileText size={24} color={colors.neutral500} />
          <View style={s.fileInfo}>
            <Text style={s.fileName} numberOfLines={1}>
              {value.name}
            </Text>
            {value.size != null && (
              <Text style={s.fileSize}>{formatFileSize(value.size)}</Text>
            )}
          </View>
          <Pressable
            testID={`${testID}-remove`}
            onPress={() => onChange(null)}
            style={s.removeBtn}
          >
            <X size={20} color={colors.error500} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          testID={`${testID}-pick`}
          onPress={handlePick}
          style={[
            s.dropzone,
            error ? s.dropzoneError : s.dropzoneDefault,
            disabled && s.dropzoneDisabled,
          ]}
        >
          <Upload
            size={24}
            color={error ? colors.error500 : colors.neutral400}
          />
          <View style={s.dropzoneContent}>
            <Text
              style={[s.dropzoneText, error ? s.dropzoneTextError : undefined]}
            >
              {placeholder || 'Appuyer pour choisir un fichier'}
            </Text>
            <Text style={s.dropzoneHint}>
              {formatAcceptedTypes(acceptedTypes)}
            </Text>
          </View>
        </Pressable>
      )}

      {error && !value && <Text style={s.errorText}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral700,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.neutral50,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 8,
  },
  fileInfo: { flex: 1, marginLeft: 12 },
  fileName: { fontSize: 14, fontWeight: '500', color: colors.neutral900 },
  fileSize: { fontSize: 12, color: colors.neutral500 },
  removeBtn: { padding: 4 },
  dropzoneContent: { flex: 1, marginLeft: 12 },
  dropzone: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    minHeight: 56,
  },
  dropzoneDefault: {
    borderColor: colors.neutral300,
    backgroundColor: colors.neutral50,
  },
  dropzoneError: {
    borderColor: colors.error500,
    backgroundColor: colors.error50,
  },
  dropzoneDisabled: { opacity: 0.5 },
  dropzoneText: { fontSize: 14, color: colors.neutral500 },
  dropzoneTextError: { color: colors.error500 },
  dropzoneHint: { fontSize: 12, color: colors.neutral400 },
  errorText: { marginTop: 4, fontSize: 14, color: colors.error500 },
});
