import type {
  Control,
  FieldError,
  FieldErrorsImpl,
  Merge,
  RegisterOptions,
} from 'react-hook-form';
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

export type ContentAlign = 'top' | 'center' | 'bottom'; // alignement du contenu dans la step

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
  showWhen?: {
    // condition pour afficher le champ nom de votre marie
    field: string;
    value: any;
  };
};

export type StepType = 'form' | 'custom'; // type de step, custom = step personnalisée

export type ButtonPosition = // position des boutons
  'center' | 'bottom' | 'bottom-raised' | 'top' | 'custom';

export type FormStep = {
  title?: string;
  description?: string;
  fields: FormField[];
  type?: StepType;
  render?: (
    data: FormData,
    goToNextStep: () => void,
    goToPreviousStep: () => void
  ) => React.ReactNode;
  header?: (data?: Record<string, any>) => React.ReactNode;
  onStepComplete?: (data: FormData) => Promise<FormData | void>;
  /**
   * Position des boutons Back / Suivant / Valider pour cette étape.
   * Par défaut : `'center'` (dans le flux du ScrollView).
   */
  buttonPosition?: ButtonPosition;
  contentAlign?: ContentAlign; // ← nouveau
  //isNextDisabled?: boolean;
  isNextDisabled?: boolean | ((values: FormData) => boolean); // soit un boolean soit une fonction qui retourne un boolean
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

export type StepFormFieldProps = {
  field: FormField;
  control: Control<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<FormData>>;
  defaultValue?: any;
};
