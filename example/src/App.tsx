import { StepFormBuilder } from '../../src/index';
import {
  View,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Text, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import PaymentSelector from '../../src/components/PaymentSelector';

// ─── Types ─────────────────────────────
interface PaymentMethod {
  serviceFeatureId: number;
  name: string;
  logo: string;
}

interface Fees {
  financialFees: number;
  collectReceiverFinancialFees: number;
}

// ─── DATA ─────────────────────────────
const data = {
  marital_status: [
    { label: 'YES', value: 'Oui' },
    { label: 'NO', value: 'Non' },
    { label: 'MAYBES', value: 'on dirait' },
    { label: 'Divorced', value: 'divorced' },
  ],
  countries: [
    { label: 'Cameroun', value: 'CM' },
    { label: 'France', value: 'FR' },
  ],
  regions_cameroun: [
    { label: 'Douala', value: 'DO' },
    { label: 'Yaoundé', value: 'YA' },
  ],
  PaymentMethod: [
    {
      serviceFeatureId: 1,
      name: 'Orange Money',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjykY3ZcP7kv0RJjPwvZhDZB6M7Vggpx8P9w&s',
    },
    {
      serviceFeatureId: 2,
      name: 'Mobile Money',
      logo: 'https://hcmagazines.com/wp-content/uploads/2023/09/mtn-1-1200x900.jpg',
    },
    {
      serviceFeatureId: 3,
      name: 'AfrikPay',
      logo: 'https://afrikpay.com/assets/img/logo.png',
    },
  ],
};

// ─── HELPERS ─────────────────────────────
const getPaymentConfig = (method: PaymentMethod | null) => {
  if (!method) return null;
  const name = method.name.toLowerCase();

  return {
    requiresPin: name.includes('afrik'),
    requiresPhone: !name.includes('afrik'),
  };
};

const formatAmount = (amount: number) =>
  `${amount.toLocaleString('fr-FR')} FCFA`;

// ─── APP ─────────────────────────────
export default function App() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentFeatures, setPaymentFeatures] = useState<PaymentMethod[]>([]);
  const [fees, setFees] = useState<Fees | null>(null);

  const invoice = {
    reference: '11 111 111',
    name: 'Canal+',
    amount: 15000,
  };

  // ─── Load paiement ───────────────────
  useEffect(() => {
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentFeatures(data.PaymentMethod);
      setPaymentLoading(false);
    }, 800);
  }, []);

  // ─── Fees ───────────────────────────
  const getFees = async () => {
    await new Promise((r) => setTimeout(r, 300));
    setFees({
      financialFees: 500,
      collectReceiverFinancialFees: 100,
    });
  };

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <KeyboardAvoidingView
          style={styles.containerKeyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Text variant="titleLarge">Step Form Paiement</Text>

              <StepFormBuilder
                onSubmit={console.log}
                steps={[
                  // ─────────────────────────
                  // ETAPE 1
                  {
                    title: 'Information Personnelles',
                    fields: [
                      { name: 'name', label: 'Nom', type: 'text' },
                      { name: 'age', label: 'Age', type: 'number' },
                    ],
                    isNextDisabled(values) {
                      // pour la validation des champs  avant de passer a l'etape suivant
                      return !values.name || !values.age;
                    },
                    onStepComplete(formData) {
                      // fonction appler lorsque le user clique sur Next
                      console.log('data', formData);
                      return Promise.resolve(formData);
                    },
                  },

                  // ─────────────────────────
                  // ETAPE 2
                  {
                    title: 'Information Legales',
                    fields: [
                      {
                        name: 'is_married',
                        label: 'Êtes-vous mariez?',
                        type: 'select',
                        options: data.marital_status,
                        validation: {
                          required: { value: true, message: 'Requis' },
                        },
                      },
                      {
                        name: 'married',
                        label: 'Nom du conjoint',
                        type: 'text',
                        showWhen: { field: 'is_married', value: 'Oui' },
                      },
                      {
                        name: 'is_worker',
                        label: 'Travaillez-vous?',
                        type: 'checkbox',
                      },
                    ],
                    onStepComplete(formData) {
                      console.log('data', formData);
                      return Promise.resolve(formData);
                    },
                  },

                  // ─────────────────────────
                  // ETAPE 3
                  {
                    title: 'Localisation',
                    fields: [
                      {
                        name: 'country',
                        label: 'Pays',
                        type: 'select',
                        options: data.countries,
                        validation: {
                          required: { value: true, message: 'Requis' },
                        },
                      },
                      {
                        name: 'city',
                        label: 'Ville',
                        type: 'text',
                        validation: {
                          required: { value: true, message: 'Requis' },
                        },
                      },
                      {
                        name: 'region',
                        label: 'Région',
                        type: 'select',
                        showWhen: { field: 'country', value: 'CM' },
                        options: data.regions_cameroun,
                      },
                    ],
                    onStepComplete(formData) {
                      console.log('étape 3:', formData);
                      return Promise.resolve(formData);
                    },
                  },

                  // ─────────────────────────
                  // ETAPE 4 (CHOIX PAIEMENT)
                  {
                    title: 'Moyen de paiement',
                    type: 'custom',
                    buttonPosition: 'center',
                    isNextDisabled: !selectedMethod,
                    render: () => (
                      <>
                        <Text style={styles.subtitle}>
                          Sélectionnez votre moyen de paiement
                        </Text>

                        <PaymentSelector
                          features={paymentFeatures}
                          paymentLoading={paymentLoading}
                          selectedMethod={selectedMethod}
                          onSelect={(m) => setSelectedMethod(m)}
                          title="Paiement"
                        />
                      </>
                    ),
                    onStepComplete: async () => {
                      if (!selectedMethod) {
                        throw new Error('Veuillez sélectionner un moyen');
                      }

                      await getFees(); // pour recuperer les fees

                      return {
                        selectedMethodId: selectedMethod.serviceFeatureId,
                      };
                    },
                  },

                  // ─────────────────────────
                  // ETAPE 5 (RECAP + SUBMIT AUTO)
                  {
                    title: 'Récapitulatif',
                    type: 'custom',

                    fields: getPaymentConfig(selectedMethod)?.requiresPin
                      ? [
                          {
                            name: 'pinCode',
                            label: 'Code PIN',
                            type: 'password',
                            validation: {
                              required: { value: true, message: 'PIN requis' },
                              minLength: { value: 4, message: '4 chiffres' },
                            },
                            //editable: (v: any) => (v.pinCode?.length ?? 0) < 4
                          },
                        ]
                      : [
                          {
                            name: 'phoneNumber',
                            label: 'Téléphone',
                            type: 'phone',
                            validation: {
                              required: {
                                value: true,
                                message: 'Téléphone requis',
                              },
                              minLength: { value: 9, message: '9 chiffres' },
                            },
                          },
                        ],

                    isNextDisabled: (v: any) => {
                      const config = getPaymentConfig(selectedMethod);
                      if (!config) return true;

                      if (config.requiresPin) {
                        return (v.pinCode?.length ?? 0) !== 4;
                      }
                      return (v.phoneNumber?.length ?? 0) < 9;
                    },

                    render: () => {
                      const totalFees =
                        (fees?.financialFees ?? 0) +
                        (fees?.collectReceiverFinancialFees ?? 0);

                      const total = invoice.amount + totalFees;

                      return (
                        <>
                          {/* CARD STYLE IDENTIQUE */}
                          <View style={styles.invoiceCard}>
                            <Text style={styles.invoiceTitle}>
                              Paiement de facture - {invoice.name}
                            </Text>

                            <View style={styles.divider} />

                            <Text style={styles.invoiceLine}>
                              Référence :{' '}
                              <Text style={styles.invoiceValue}>
                                {invoice.reference}
                              </Text>
                            </Text>

                            <Text style={styles.invoiceLine}>
                              Montant :{' '}
                              <Text style={styles.invoiceValueBold}>
                                {formatAmount(invoice.amount)}
                              </Text>
                            </Text>

                            <View style={styles.divider} />

                            <Text style={styles.invoiceLine}>
                              Frais de service :{' '}
                              <Text style={styles.invoiceValueBold}>
                                {formatAmount(fees?.financialFees ?? 0)}
                              </Text>
                            </Text>

                            <Text style={styles.invoiceLine}>
                              Montant total :{' '}
                              <Text style={styles.invoiceValueBold}>
                                {formatAmount(
                                  invoice.amount + (fees?.financialFees ?? 0)
                                )}
                              </Text>
                            </Text>

                            <Text style={styles.invoiceLine}>
                              Frais opérateur :{' '}
                              <Text style={styles.invoiceValueBold}>
                                {formatAmount(
                                  fees?.collectReceiverFinancialFees ?? 0
                                )}
                              </Text>
                            </Text>

                            <View style={styles.divider} />

                            <Text style={styles.invoiceTotal}>
                              Montant à payer : {formatAmount(total)}
                            </Text>
                          </View>

                          {/* PAYER AVEC */}
                          <Text style={styles.payerAvecLabel}>
                            Payer avec :
                          </Text>

                          <View style={styles.selectedPaymentRow}>
                            <Image
                              source={{ uri: selectedMethod?.logo }}
                              style={styles.logo}
                            />
                            <Text style={styles.paymentText}>
                              {selectedMethod?.name}
                            </Text>
                          </View>
                        </>
                      );
                    },

                    //  SUBMISSION AUTOMATIQUE
                    onStepComplete: async (values) => {
                      const config = getPaymentConfig(selectedMethod);

                      const payload = {
                        invoice,
                        fees: {
                          ...fees,
                          total:
                            invoice.amount +
                            (fees?.financialFees ?? 0) +
                            (fees?.collectReceiverFinancialFees ?? 0),
                        },
                        payment: {
                          serviceFeatureId: selectedMethod?.serviceFeatureId,
                          method: selectedMethod?.name,
                          ...(config?.requiresPin && { pin: values.pinCode }),
                          ...(config?.requiresPhone && {
                            phoneNumber: values.phoneNumber,
                          }),
                        },
                      };

                      console.log('Paiement envoyé:', payload);

                      return payload; // déclenche la soumission globale
                    },
                  },
                  {
                    title: 'Information Personnelles',
                    fields: [
                      { name: 'name', label: 'Nom', type: 'text' },
                      { name: 'sexe', label: 'sexe', type: 'text' },
                    ],
                    isNextDisabled(values) {
                      // pour la validation des champs  avant de passer a l'etape suivant
                      return !values.name || !values.age;
                    },
                    onStepComplete(formData) {
                      // fonction appler lorsque le user clique sur Next
                      console.log('data', formData);
                      return Promise.resolve(formData);
                    },
                  },
                ]}
                defaultValues={{ name: 'cedigno', is_worker: true }}
                externalValues={{}}
                onError={console.error}
                onExternalValueChange={console.warn}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// ─── Styles ─────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerKeyboard: {
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },

  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  total: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },

  info: {
    fontSize: 12,
    color: '#666',
  },

  invoiceCard: {
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1fae5',
    marginBottom: 15,
  },

  invoiceTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },

  invoiceLine: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 6,
  },

  invoiceValue: {
    color: '#111827',
  },

  invoiceValueBold: {
    fontWeight: '600',
    color: '#111827',
  },

  invoiceTotal: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#1d4ed8',
  },

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },

  payerAvecLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  selectedPaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },

  paymentText: {
    fontWeight: '600',
    fontSize: 15,
  },

  logo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
