import { SelectProvider } from '../../context/SelectContext';
import SelectInput from './SelectInput';

export default function SelectInputWrapper({
  options = [],
  placeholder,
}: {
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}) {
  return (
    <SelectProvider options={options}>
      <SelectInput placeholder={placeholder} />
    </SelectProvider>
  );
}
