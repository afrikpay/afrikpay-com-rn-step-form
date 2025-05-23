# rn-step-form

A react native step form

## Installation

```sh
npm install rn-step-form
```

```sh
yarn add rn-step-form
```

## Usage

```js
import { StepFormBuilder } from 'rn-step-form';

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
