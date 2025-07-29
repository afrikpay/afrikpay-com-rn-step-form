import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

type FieldOption = {
  id: string;
  options: any[];
  visible: boolean;
};

const SelectContext = createContext<{
  options?: Array<{ label: string; value: string }>;
  setOptions?: Dispatch<React.SetStateAction<any[] | undefined>>;
  fields?: Array<FieldOption>;
  setFields?: Dispatch<React.SetStateAction<Array<FieldOption>>>;
  currentField?: string;
  setCurrentField?: Dispatch<React.SetStateAction<string | undefined>>;
  onChangeFieldVisibility?: any;
}>({});

export function useSelect() {
  const value = useContext(SelectContext);
  if (!value) {
    throw new Error('useSelect must be wrapped in a <SelectProvider />');
  }

  return value;
}

export function SelectProvider({
  children,
  options,
}: PropsWithChildren & { options?: Array<{ label: string; value: string }> }) {
  const [ops, setOptions] = useState<any[]>();
  const [fields, setFields] = useState<Array<FieldOption>>([]);
  const [currentField, setCurrentField] = useState<string>();

  useEffect(() => {
    setOptions(options);
  }, [options]);

  const onChangeFieldVisibility = (id: string) => {
    setFields((prev) => {
      return prev.map((field) => {
        if (field.id !== id) {
          field.visible = !field.visible;
        }

        return field;
      });
    });
    setCurrentField(id);
  };

  return (
    <SelectContext.Provider
      value={{
        options: ops,
        setOptions,
        onChangeFieldVisibility,
        fields,
        setFields,
        currentField,
        setCurrentField,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}
