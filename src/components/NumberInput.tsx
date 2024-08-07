"use client";

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
  initialValue?: string;
  onChange?: (value: string) => void;
  id?: string;
  placeholder?: string;
  required?: boolean;
  validate?: (value: string) => boolean;
  isWholeNumber?: boolean;
  min?: number;
  disabled?: boolean | undefined;
  positiveOnly?: boolean;
};

export function useNumberInput(props: Props) {
  const [value, setValue] = useState(props.initialValue ?? "");
  const [dirty, setDirty] = useState(false);

  const reactId = useId();
  const id = props.id ?? reactId;
  const placeholder = props.placeholder ?? "1000";
  const valid = isValid();
  const step = props.isWholeNumber ? 1 : 1e18;
  const min = props.min ?? 0;
  const disabled = props.disabled ?? false;

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

  const error = (() => {
    if (props.validate && !props.validate(value)) {
      return "Invalid input"; // generic error message
    }
    if (props.positiveOnly && Number(value) < 0) {
      return "Positive values only";
    }
    if (props.required && !value) {
      return "Required";
    }
    if (props.min && Number(value) < props.min) {
      return `Minimum value: ${props.min}`;
    }
  })();

  function isValid() {
    if (props.required && dirty && value === "") {
      return false;
    }
    if (props.positiveOnly && Number(value) < 0) {
      return false;
    }
    if (props.validate && !props.validate(value)) {
      return false;
    }
    if (props.min && Number(value) < props.min) {
      return false;
    }
    return true;
  }

  return useMemo(
    () => ({
      ...props,
      value,
      onChange,
      step,
      valid,
      id,
      placeholder,
      min,
      disabled,
      setValue,
      error,
    }),
    [
      props,
      value,
      onChange,
      step,
      valid,
      id,
      placeholder,
      min,
      disabled,
      setValue,
      error,
    ],
  );
}

type NumberInputProps = ReturnType<typeof useNumberInput>;

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
    <div className="relative">
      <label
        htmlFor={props.id}
        className={`mb-1 block font-semibold ${labelStyle}`}
      >
        {props.label}
      </label>
      <input
        type="number"
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        placeholder={`E.g. “${props.placeholder}”`}
        step={props.step}
        min={props.min}
        className={`h-11 w-full rounded-lg border px-3 py-2 shadow-xs ${inputStyle} disabled:cursor-not-allowed disabled:opacity-50`}
        disabled={props.disabled}
      />
      {props.error && (
        <div className="absolute -bottom-4 left-0 text-xs text-primary-500">
          {props.error}
        </div>
      )}
    </div>
  );
}
