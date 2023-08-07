import {
  useId,
  useMemo,
  useState,
  type ChangeEventHandler,
  type ReactNode,
} from "react";
type Props = {
  label: ReactNode;
  id?: string;
  placeholder?: string;
};

export function useNumberInput(props: Props) {
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState(new Set<string>());
  const reactId = useId();
  const id = props.id ?? reactId;
  const placeholder = props.placeholder ?? "Enter a value";
  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value);
  };

  return useMemo(
    () => ({
      ...props,
      value,
      onChange,
      id,
      placeholder,
    }),
    [value],
  );
}

export type NumberInputProps = ReturnType<typeof useNumberInput>;

export function NumberInput(props: NumberInputProps) {
  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        type="number"
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    </div>
  );
}
