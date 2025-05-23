import type { RegisterOptions } from 'react-hook-form';
import type { TextInputProps } from 'react-native-paper';

export type ValidationRule =
  | Omit<
      RegisterOptions<any, string>,
      'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
    >
  | undefined;

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'phone'
  | 'select'
  | 'checkbox'
  | 'date';

export type FormField = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string;
  validation?: ValidationRule;
  disabled?: boolean;
  leftIcon?: () => React.ReactNode;
  rightIcon?: () => React.ReactNode;
  options?: Array<{ label: string; value: string }>;
  inputProps?: Partial<TextInputProps>;
};

export type FormStep = {
  title?: string;
  description?: string;
  fields: FormField[];
  header?: (data?: Record<string, any>) => React.ReactNode;
  onStepComplete?: (data: FormData) => Promise<FormData | void>;
};

export type FormButton = {
  text: string;
  mode: 'contained' | 'outlined' | 'text';
  onPress?: () => void;
  style?: any;
  loading?: boolean;
  disabled?: boolean;
};

export type FormData = Record<string, any>;

export type StepFormBuilderProps = {
  steps: FormStep[];
  onSubmit: (data: FormData) => void | Promise<void>;
  onError?: (errors: Record<string, any>) => void;
  defaultValues?: FormData;
  externalValues?: FormData;
  onExternalValueChange?: (name: string, value: any) => void;
};
