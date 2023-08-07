import {
  useId,
  useMemo,
  useState,
  type ChangeEventHandler,
  type ReactNode,
} from "react";
import { useImmer } from "use-immer";
type Props = {
  label: ReactNode;
  onChange?: (value: string) => void;
  id?: string;
  placeholder?: string;
};

import { useCallback } from "react";
export function useNumberInput(props: Props) {
  const [value, setValue] = useState("");
  const [errors, setErrors] = useImmer(new Set<string>());
  const reactId = useId();
  const id = props.id ?? reactId;
  const placeholder = props.placeholder ?? "Enter a value";

  const { onChange: onChangeProp } = props;
  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const value = event.target.value;
      onChangeProp?.(value);
      setValue(value);
    },
    [onChangeProp],
  );

  const addError = useCallback(
    (error: string) => {
      setErrors((errors) => {
        errors.add(error);
      });
    },
    [setErrors],
  );

  const removeError = useCallback(
    (error: string) => {
      setErrors((errors) => {
        errors.delete(error);
      });
    },
    [setErrors],
  );

  const clearErrors = useCallback(() => {
    setErrors((errors) => {
      errors.clear();
    });
  }, [setErrors]);

  return useMemo(
    () => ({
      ...props,
      value,
      onChange,
      id,
      placeholder,
      errors: Array.from(errors),
      addError,
      removeError,
      clearErrors,
    }),
    [
      value,
      props,
      id,
      placeholder,
      errors,
      addError,
      clearErrors,
      removeError,
      onChange,
    ],
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
      {props.errors.map((error) => (
        <p className="text-error-500" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}
