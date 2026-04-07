import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
interface PaymentMethod {
  serviceFeatureId: number;
  name: string;
  logo: string;
}

interface PaymentSelectorProps {
  features: PaymentMethod[];
  paymentLoading: boolean;
  onSelect: (method: PaymentMethod) => void;
  selectedMethod: PaymentMethod | null;
  title?: string;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  features,
  paymentLoading,
  onSelect,
  selectedMethod,
  title = 'paiement',
}) => {
  const handleSelect = useCallback(
    (item: PaymentMethod) => {
      onSelect(item);
    },
    [onSelect]
  );

  return (
    <View>
      <Text style={styles.titles}>{title}</Text>
      {paymentLoading ? (
        <ActivityIndicator
          size="large"
          style={styles.loadingActivityIndicator}
        />
      ) : (
        <>
          <View style={styles.paymentContainer}>
            {features.map((item) => (
              <View key={item.serviceFeatureId} style={styles.paymentWrapper}>
                <TouchableOpacity
                  style={[
                    styles.paymentItems,
                    selectedMethod?.serviceFeatureId ===
                      item.serviceFeatureId && styles.selectedPaymentItem,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Image
                    source={{ uri: item.logo }}
                    style={styles.paymentImage}
                  />
                </TouchableOpacity>
                <Text style={styles.paymentText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paymentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 16,
  },
  paymentWrapper: {
    paddingBottom: 16,
    width: '33%',
    alignItems: 'center',
  },
  paymentItem: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  paymentImage: {
    width: 48,
    height: 48,
    borderRadius: 7,
  },
  paymentText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  loadingActivityIndicator: {
    marginTop: 10,
  },
  titles: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  paymentItems: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    // ... vos autres styles de base
  },
  selectedPaymentItem: {
    borderColor: '#0070ba',
    borderWidth: 2,
  },
});

export default PaymentSelector;
