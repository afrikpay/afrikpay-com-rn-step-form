# rn-step-form

A react native step form

## Installation

Le package est publie sur Artifact Registry Afrikpay. Configure d'abord ton `.npmrc` :

```
@afrikpay:registry=https://europe-west4-npm.pkg.dev/prod-app-base-060623/afrikpay-npm/
//europe-west4-npm.pkg.dev/prod-app-base-060623/afrikpay-npm/:always-auth=true
```

Authentifie-toi puis installe :

```sh
npx google-artifactregistry-auth
npm install @afrikpay/rn-step-form
```

```sh
npx google-artifactregistry-auth
yarn add @afrikpay/rn-step-form
```

## Usage

```js
import { StepFormBuilder } from '@afrikpay/rn-step-form';

// ...

<StepFormBuilder
  onSubmit={console.log}
  steps={[
    {
      title: 'Step 1',
      fields: [
        {
          name: 'field1',
          label: 'Field label',
          type: 'text',
          validation: {
            required: { message: 'This field is required', value: true },
          },
        },
        {
          name: 'field2',
          label: 'field label',
          type: 'number',
        },
      ],
      onStepComplete(data) {
        console.log('data', data);
        return Promise.resolve(data);
      },
    },
    {
      title: 'Step 2',
      fields: [
        {
          name: 'field1',
          label: 'Field label',
          type: 'text',
          validation: {
            required: { message: 'This field is required', value: true },
          },
        },
      ],
    },
  ]}
  defaultValues={{}}
  externalValues={{}}
  onError={console.error}
  onExternalValueChange={console.warn}
/>;
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
