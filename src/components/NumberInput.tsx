import {
  useCallback,
  useId,
  useMemo,
  useState,
  type ChangeEventHandler,
  type ReactNode,
} from "react";

export type Props = {
  label: ReactNode;
  onChange?: (value: string) => void;
  id?: string;
  placeholder?: string;
  required?: boolean;
  validate?: (value: string) => boolean;
};

export function useNumberInput(props: Props) {
  const [value, setValue] = useState("");
  const [dirty, setDirty] = useState(false);

  const reactId = useId();
  const id = props.id ?? reactId;
  const placeholder = props.placeholder ?? "1000";
  const valid = isValid();

  const { onChange: onChangeProp } = props;
  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const value = event.target.value;
      onChangeProp?.(value);
      setValue(value);
      setDirty(true);
    },
    [onChangeProp],
  );

  function isValid() {
    if (props.required && dirty && value === "") {
      return false;
    }
    if (props.validate && !props.validate(value)) {
      return false;
    }
    return true;
  }

  return useMemo(
    () => ({
      ...props,
      value,
      onChange,
      valid,
      id,
      placeholder,
    }),
    [props, value, onChange, valid, id, placeholder],
  );
}

export type NumberInputProps = ReturnType<typeof useNumberInput>;

export function NumberInput(props: NumberInputProps) {
  const validLabelStyle = "text-black";
  const invalidLabelStyle = "text-error-900";
  const labelStyle = props.valid ? validLabelStyle : invalidLabelStyle;
  const validStyleInputStyle =
    "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500";
  const invalidInputStyle =
    "border-error-200 bg-error-50 text-error-700 placeholder:text-error-500";
  const inputStyle = props.valid ? validStyleInputStyle : invalidInputStyle;
  return (
    <div>
      <label
        htmlFor={props.id}
        className={`font-semibold block mb-1 ${labelStyle}`}
      >
        {props.label}
      </label>
      <input
        type="number"
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        placeholder={`E.g. “${props.placeholder}”`}
        step={1e18}
        min={0}
        className={`px-3 py-2 rounded-lg shadow-xs border w-full max-w-[400px] ${inputStyle}`}
      />
    </div>
  );
}
