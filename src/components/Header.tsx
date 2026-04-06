// Header.tsx
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { LOGO } from '../constantes';

interface HeaderProps {
  onBack?: () => void;
  onLayout?: (height: number) => void;
}

export default function Header({ onBack, onLayout }: HeaderProps) {
  return (
    <View
      style={styles.container}
      onLayout={(e) => onLayout?.(e.nativeEvent.layout.height)}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          disabled={!onBack}
        >
          <ChevronLeft size={26} color="#000" strokeWidth={2} />
        </TouchableOpacity>

        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  logo: {
    width: 120,
    height: 40,
    marginLeft: 8,
  },
});
