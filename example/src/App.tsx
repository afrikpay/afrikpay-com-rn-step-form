import { StepFormBuilder } from '../../src/index';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

//const DEFAULT_VALUES = { name: 'urlrichhhhh', is_worker: true };

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.container}>
          <Text variant="titleLarge">I am testing this form builder</Text>
          <StepFormBuilder
            onSubmit={console.log}
            steps={[
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
                isNextDisabled(values) {
                  // pour la validation des champs  avant de passer a l'etape suivant
                  return !values.name || !values.age;
                },
                onStepComplete(data) {
                  // fonction appler lorsque le user clique sur Next
                  console.log('data', data);
                  return Promise.resolve(data);
                },
              },
              {
                title: 'Information Legales',
                fields: [
                  {
                    name: 'is_married',
                    label: 'Êtes-vous mariez?', // nom pas encore traduit
                    type: 'select',
                    validation: {
                      required: {
                        message: 'This field is required',
                        value: true,
                      },
                    },
                    options: [
                      { label: 'YES', value: 'Oui' },
                      { label: 'NO', value: 'Non' },
                      { label: 'MAYBE', value: 'On dirait' },
                      { label: 'YESs', value: 'Ouii' },
                      { label: 'NO0', value: 'Nonn' },
                      { label: 'MAYBEs', value: 'On diraitt' },
                      { label: 'YES1', value: 'Oui1' },
                      { label: 'NO1', value: 'Non1' },
                      { label: 'MAYBE1', value: 'On dirait1' },
                    ],
                  },
                  {
                    name: 'married',
                    label: 'Le nom de votre mari',
                    type: 'text',
                    showWhen: {
                      // condition pour afficher le champ nom de votre mari
                      field: 'is_married',
                      value: 'Oui',
                    },
                    validation: {
                      required: {
                        message: 'This field is required',
                        value: true,
                      },
                    },
                  },
                  {
                    name: 'is_worker',
                    label: 'Travailels tu?', // pour savoir si l'utilisateur travaille
                    type: 'checkbox',
                  },
                ],
                onStepComplete(data) {
                  console.log('data', data);
                  return Promise.resolve(data);
                },
              },
              {
                title: 'Localisation',
                fields: [
                  {
                    name: 'country',
                    label: 'Pays de résidence',
                    type: 'select',
                    validation: {
                      required: { message: 'Ce champ est requis', value: true },
                    },
                    options: [
                      { label: 'Cameroun', value: 'CM' },
                      { label: 'France', value: 'FR' },
                      { label: "Côte d'Ivoire", value: 'CI' },
                      { label: 'Sénégal', value: 'SN' },
                      { label: 'RDC', value: 'CD' },
                    ],
                  },
                  {
                    name: 'city',
                    label: 'Ville',
                    type: 'text',
                    validation: {
                      required: { message: 'Ce champ est requis', value: true },
                    },
                  },
                  {
                    // champ conditionnel sur le deuxième select
                    name: 'region',
                    label: 'Région (Cameroun)',
                    type: 'select',
                    showWhen: { field: 'country', value: 'CM' }, // visible si Cameroun
                    options: [
                      { label: 'Littoral', value: 'LT' },
                      { label: 'Centre', value: 'CE' },
                      { label: 'Ouest', value: 'OU' },
                      { label: 'Nord', value: 'NO' },
                    ],
                  },
                ],
                onStepComplete(data) {
                  console.log('étape 3:', data);
                  return Promise.resolve(data);
                },
              },
            ]}
            defaultValues={{ name: 'cedigno', is_worker: true }}
            externalValues={{}} // undefined
            onError={console.error}
            onExternalValueChange={console.warn}
          />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
