// ── FileField (Composant interne pour le type file)
// AJOUTÉ : Nouveau composant pour gérer la sélection de documents

import { StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { IconButton } from 'react-native-paper';

export function FileField({
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
        // On liste les types autorisés (Images, PDF, Docs, etc.)
        type: [
          'image/*', // Toutes les images
          'application/pdf', // PDF
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word
          'text/plain', // Fichiers texte
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        onChange(result.assets[0]);
      }
    } catch (err) {
      console.error('Erreur lors de la sélection du fichier:', err);
    }
  };

  return (
    <View style={fileStyles.container}>
      <Text style={[fileStyles.label, error && fileStyles.labelError]}>
        {label}
      </Text>

      <View
        style={[
          fileStyles.dropZone,
          error ? fileStyles.dropZoneError : fileStyles.dropZoneDefault,
          disabled && fileStyles.disabled,
        ]}
      >
        {!value ? (
          <TouchableOpacity
            style={fileStyles.innerBtn}
            onPress={handlePickDocument}
            disabled={disabled}
          >
            <MaterialIcons
              name="cloud-upload"
              size={28}
              color={disabled ? '#ccc' : '#6200ee'}
            />
            <Text style={fileStyles.placeholder}>
              Cliquez pour choisir un fichier
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={fileStyles.fileInfoRow}>
            <MaterialIcons name="insert-drive-file" size={24} color="#6200ee" />
            <View style={fileStyles.textContainer}>
              <Text numberOfLines={1} style={fileStyles.fileName}>
                {value.name}
              </Text>
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
}

const fileStyles = StyleSheet.create({
  container: { marginBottom: 8 },
  label: {
    fontSize: 12,
    color: '#6200ee',
    marginBottom: 4,
    fontWeight: '500',
    marginLeft: 4,
  },
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
  innerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  placeholder: { marginLeft: 10, color: '#757575', fontSize: 14 },
  fileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  textContainer: { flex: 1, marginLeft: 12 },
  fileName: { fontSize: 14, color: '#212121', fontWeight: '500' },
  fileSize: { fontSize: 11, color: '#757575' },
  disabled: { opacity: 0.5 },
});
