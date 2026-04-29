import type {
  Control,
  FieldError,
  FieldErrorsImpl,
  Merge,
  RegisterOptions,
} from 'react-hook-form';
import type { LucideIcon } from 'lucide-react-native';

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
  | 'multiline'
  | 'date'
  | 'select'
  | 'radio'
  | 'switch'
  | 'checkbox'
  | 'file';

export type FormField = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string | number | boolean | Date;
  maxLength?: number;
  validation?: ValidationRule;
  disabled?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  options?: Array<{ label: string; value: string }>;
  acceptedTypes?: string[]; // pour le type file, par exemple ['image/*', 'application/pdf']
  showWhen?: {
    field: string;
    value?: any;
    condition?: (value: any) => boolean;
  };
  editable?: (formValues: Record<string, any>) => boolean;
};

export type FormStep = {
  title?: string;
  description?: string;
  fields: FormField[];
  type?: 'custom';
  header?: (data?: Record<string, any>) => React.ReactNode;
  render?: (
    data: FormData,
    goToNext: () => void,
    goToPrev: () => void,
    setValue: (name: string, value: any) => void
  ) => React.ReactNode;
  onStepComplete?: (data: FormData) => Promise<FormData | void>;
  isNextDisabled?: boolean | ((values: FormData) => boolean);
  buttonPosition?: 'center' | 'bottom' | 'bottom-raised';
  // Options d'affichage de la progression
  showProgressBar?: boolean; // Afficher/cacher la barre de progression
  showStepNumbers?: boolean; // Afficher/cacher les numéros d'étapes (1, 2, 3...)
  showStepCount?: boolean; // Afficher/cacher le compteur (1/4, 2/4...)
  // Style personnalisé du titre
  titleStyle?: {
    fontSize?: number;
    fontWeight?:
      | 'normal'
      | 'bold'
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900';
    color?: string;
  };
};

export type FormData = Record<string, any>;

export type FlowOptions = {
  showProgressBar?: boolean; // Afficher/cacher la barre de progression pour tout le flow
  showStepNumbers?: boolean; // Afficher/cacher les numéros d'étapes pour tout le flow
  showStepCount?: boolean; // Afficher/cacher le compteur pour tout le flow
  titleStyle?: {
    fontSize?: number;
    fontWeight?:
      | 'normal'
      | 'bold'
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900';
    color?: string;
  };
};

export type StepFormBuilderProps = {
  steps: FormStep[];
  onSubmit: (data: FormData) => void | Promise<void>;
  onError?: (errors: Record<string, any>) => void;
  defaultValues?: FormData;
  externalValues?: FormData;
  onExternalValueChange?: (name: string, value: any) => void;
  resolver?: any;
  nextLabel?: string;
  backLabel?: string;
  submitLabel?: string;
  testID?: string;
  flowOptions?: FlowOptions; // Options de progression globales pour tout le flow
};

export type StepFormFieldProps = {
  field: FormField;
  control: Control<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<FormData>>;
  defaultValue?: any;
  formValues?: FormData;
};
