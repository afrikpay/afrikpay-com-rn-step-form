import { StepFormBuilder } from 'rn-step-form';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
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
              onStepComplete(data) {
                console.log('data', data);
                return Promise.resolve(data);
              },
            },
            {
              title: 'Information Legales',
              fields: [
                {
                  name: 'is_married',
                  label: 'ÊteS-vous mariez?',
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
                  ],
                },
                {
                  name: 'married',
                  label: 'Le nom de votre mari',
                  type: 'text',
                  validation: {
                    required: {
                      message: 'This field is required',
                      value: true,
                    },
                  },
                },
                {
                  name: 'is_worker',
                  label: 'Travailels tu?',
                  type: 'checkbox',
                },
              ],
              onStepComplete(data) {
                console.log('data', data);
                return Promise.resolve(data);
              },
            },
          ]}
          defaultValues={{ name: 'urlrichhhhh', is_worker: true }}
          externalValues={{}}
          onError={console.error}
          onExternalValueChange={console.warn}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
