import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

export default function SelectInput({ placeholder }: { placeholder?: string }) {
  return (
    <View style={styles.containerFlex}>
      <TouchableOpacity style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={[styles.text]}>{placeholder}</Text>
          <AntDesign name="down" size={20} color="#333" style={styles.icon} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerFlex: { flex: 1 },
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#888',
  },
  icon: {
    marginLeft: 8,
  },
});
