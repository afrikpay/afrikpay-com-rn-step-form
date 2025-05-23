import { StepFormBuilder } from 'rn-step-form';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function App() {
  return (
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
                validation: {
                  required: { message: 'This field is required', value: true },
                },
              },
              {
                name: 'age',
                label: 'Age',
                type: 'number',
                validation: {
                  min: { message: 'You must be older than 5 years', value: 5 },
                },
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
                name: 'married',
                label: 'Vous etes marie?',
                type: 'text',
                validation: {
                  required: { message: 'This field is required', value: true },
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
        defaultValues={{}}
        externalValues={{}}
        onError={console.error}
        onExternalValueChange={console.warn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
