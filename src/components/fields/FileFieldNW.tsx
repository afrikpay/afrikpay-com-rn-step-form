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
};

function formatFileSize(bytes: number | undefined): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
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
    if (disabled) return;
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf', 'application/msword', 'text/plain'],
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
          <Text
            style={[s.dropzoneText, error ? s.dropzoneTextError : undefined]}
          >
            Appuyer pour choisir un fichier
          </Text>
          <Text style={s.dropzoneHint}>PDF, Image, Word, Texte</Text>
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
  dropzone: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
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
  dropzoneText: { marginTop: 8, fontSize: 14, color: colors.neutral500 },
  dropzoneTextError: { color: colors.error500 },
  dropzoneHint: { marginTop: 4, fontSize: 12, color: colors.neutral400 },
  errorText: { marginTop: 4, fontSize: 14, color: colors.error500 },
});
