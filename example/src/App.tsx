import { StepFormBuilder } from '@afrikpay/rn-step-form';
import {
  View,
  StyleSheet,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import PaymentSelector from '../../src//components/PayementSelector';

const data = {
  marital_status: [
    { label: 'YES', value: 'Oui' },
    { label: 'NO', value: 'Non' },
    { label: 'MAYBES', value: 'on dirait' },
    { label: 'Divorced', value: 'divorced' },
  ],
  gender_options: [
    { label: 'Masculin', value: 'M' },
    { label: 'Féminin', value: 'F' },
    { label: 'Autre', value: 'A' },
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
      <GestureHandlerRootView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'height' pour Android aussi
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <StepFormBuilder
                onSubmit={(formData) =>
                  console.log(JSON.stringify(formData, null, 2))
                }
                steps={[
                  {
                    title: 'Information Personnelles',
                    fields: [
                      {
                        name: 'name',
                        label: 'Nom',
                        type: 'text',
                        validation: { required: 'Nom requis' },
                      },
                      {
                        name: 'age',
                        label: 'Age',
                        type: 'number',
                        validation: { required: 'Age requis' },
                      },
                    ],
                    //isNextDisabled: (values) => !values.name || !values.age,
                    isNextDisabled: (values) => {
                      return !(values.name && values.age);
                    },
                    onStepComplete(stepData) {
                      console.log('data', stepData);
                      return Promise.resolve(stepData);
                    },
                  },

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
                    // AJOUT DE LA LOGIQUE DE VALIDATION pour le champ conjoint
                    isNextDisabled(values) {
                      const isMarriedSelected = values.is_married === 'Oui';
                      const spouseNameEmpty =
                        !values.married || values.married.trim() === '';

                      // On bloque si :
                      // 1. Le statut marital n'est pas sélectionné
                      // 2. OU si "Oui" est coché MAIS que le nom du conjoint est vide
                      if (!values.is_married) return true;
                      if (isMarriedSelected && spouseNameEmpty) return true;

                      return false;
                    },

                    onStepComplete(stepData) {
                      console.log('data', stepData);
                      return Promise.resolve(stepData);
                    },
                  },

                  {
                    title: 'Information Personnelles',
                    fields: [
                      {
                        name: 'name',
                        label: 'Nom',
                        type: 'text',
                      },
                      {
                        name: 'age',
                        label: 'Age',
                        type: 'number',
                      },
                    ],
                    onStepComplete(stepData) {
                      console.log('data', stepData);
                      return Promise.resolve(stepData);
                    },
                  },

                  {
                    title: 'Document',
                    fields: [
                      {
                        name: 'id_file',
                        label: 'Télécharger le document',
                        type: 'file',
                      },
                      {
                        name: 'age',
                        label: 'Age',
                        type: 'number',
                      },
                    ],
                    isNextDisabled: (values) => {
                      return !(values.id_file && values.age);
                    },
                    onStepComplete(stepData) {
                      console.log('data', stepData);
                      return Promise.resolve(stepData);
                    },
                  },
                  {
                    title: 'Informations de naissance',
                    fields: [
                      {
                        name: 'birthDate', // Nom unique pour la date
                        label: 'Date de naissance',
                        type: 'date',
                        validation: { required: 'La date est obligatoire' },
                      },
                      {
                        name: 'gender_manual',
                        label: 'Sexe',
                        type: 'text',
                        placeholder: 'Ex: Masculin',
                      },
                    ],
                    isNextDisabled(values) {
                      // On vérifie que birthDate existe et est bien une instance de Date
                      const hasDate = values.birthDate instanceof Date;
                      const hasGender =
                        values.gender_manual &&
                        values.gender_manual.trim() !== '';

                      return !hasDate || !hasGender;
                    },
                    onStepComplete(formData) {
                      // La date sera un objet Date JS ici
                      console.log(
                        'Date sélectionnée :',
                        formData.birthDate.toLocaleDateString()
                      );
                      return Promise.resolve(formData);
                    },
                  },
                  {
                    title: 'Profil',
                    fields: [
                      {
                        name: 'gender',
                        label: 'Quel est votre sexe ?',
                        type: 'radio',
                        options: data.gender_options,
                        validation: {
                          required: {
                            value: true,
                            message: 'Sélectionnez une option',
                          },
                        },
                      },
                    ],
                    isNextDisabled: (values) => !values.gender,
                  },

                  {
                    title: 'Informations Personnelles',
                    fields: [
                      {
                        name: 'email', // Changé 'name' par 'email' pour la cohérence
                        label: 'Email',
                        type: 'email',
                        validation: {
                          required: 'Email requis',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Format d'email invalide",
                          },
                        },
                      },
                      {
                        name: 'show_bio',
                        label: 'Souhaitez-vous ajouter une biographie ?',
                        type: 'switch',
                        defaultValue: false,
                      },
                      {
                        name: 'bio',
                        label: 'Ma biographie',
                        type: 'multiline',
                        placeholder: 'Parlez-nous de vous...',
                        showWhen: { field: 'show_bio', value: true },
                        validation: {
                          maxLength: 200,
                          //numberOfLines: 5,
                          required:
                            "La biographie est requise si l'option est activée",
                        },
                      },
                      {
                        name: 'accept_terms',
                        label: "Accepter les conditions d'utilisation",
                        type: 'switch',
                        defaultValue: false, // Important pour TypeScript
                        validation: {
                          required: 'Vous devez accepter pour continuer',
                        },
                      },
                    ],
                    isNextDisabled: (values) => {
                      // On utilise les nouveaux noms de champs ici
                      const emailValid =
                        !!values.email &&
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                          values.email
                        );
                      const bioValid = values.show_bio
                        ? !!values.bio && values.bio.length > 0
                        : true;
                      const termsValid = !!values.accept_terms;

                      return !emailValid || !bioValid || !termsValid;
                    },
                  },

                  // ─────────────────────────
                  // ETAPE 4 (CHOIX PAIEMENT)
                  // ETAPE 4 (CHOIX PAIEMENT)
                  {
                    title: 'Moyen de paiement',
                    type: 'custom',
                    fields: [],
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
                              maxLength: {
                                value: 4,
                                message: '4 chiffres maximum',
                              },
                            },
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
                              maxLength: {
                                value: 9,
                                message: '9 chiffres maximum',
                              },
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
                ]}
                defaultValues={{ name: 'ulrich', is_worker: true }}
                externalValues={{}}
                onError={console.error}
                onExternalValueChange={console.warn}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  //

  titlePrincipal: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    //marginTop: 50,
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
    //paddingBottom: 40,
  },
});
