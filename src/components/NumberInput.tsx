import {
  useCallback,
  useId,
  useMemo,
  useState,
  type ChangeEventHandler,
  type ReactNode,
} from "react";

type Props = {
  label: ReactNode;
  onChange?: (value: string) => void;
  id?: string;
  placeholder?: string;
};

export function useNumberInput(props: Props) {
  const [value, setValue] = useState("");
  const reactId = useId();
  const id = props.id ?? reactId;
  const placeholder = props.placeholder ?? "1000";

  const { onChange: onChangeProp } = props;
  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const value = event.target.value;
      onChangeProp?.(value);
      setValue(value);
    },
    [onChangeProp],
  );

  return useMemo(
    () => ({
      ...props,
      value,
      onChange,
      id,
      placeholder,
    }),
    [value, props, id, placeholder, onChange],
  );
}

export type NumberInputProps = ReturnType<typeof useNumberInput>;

export function NumberInput(props: NumberInputProps) {
  return (
    <div>
      <label htmlFor={props.id} className="font-semibold block mb-1">
        {props.label}
      </label>
      <input
        type="number"
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        placeholder={`E.g. “${props.placeholder}”`}
        className="px-3 py-2 rounded-lg shadow-xs border border-gray-300 bg-white text-gray-500"
      />
    </div>
  );
}
