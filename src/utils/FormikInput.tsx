import React from 'react';
import { useField } from 'formik';

type FormikInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  suffix?: React.ReactNode;
};

const FormikInput: React.FC<FormikInputProps> = ({ label, suffix, ...props }) => {
  const [field, meta] = useField(props.name);
  const isInvalid = meta.touched && !!meta.error;
  const inputBaseClasses =
    "w-full px-3 py-2 border rounded-lg bg-gray-800 text-white focus:outline-none";

  const inputStateClasses = isInvalid
    ? "border-red-500 focus:ring-1 focus:ring-red-500" // Error state
    : "border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"; // Normal state

  const inputPadding = suffix ? "pr-10" : "";

  return (
    <div>
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...field}
          {...props}
          id={props.name}
          className={`${inputBaseClasses} ${inputStateClasses} ${inputPadding}`}
          onKeyDown={(e) => {
            if (props.type === "password" && e.key === " ") {
              e.preventDefault();
            }
            props.onKeyDown && props.onKeyDown(e);
          }}
          onChange={(e) => {
            let value = e.target.value;

            if (props.type === "password") {
              value = value.replace(/\s+/g, ""); 
            }

            field.onChange({
              target: { name: props.name, value }
            });
          }}
        />

        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {suffix}
          </div>
        )}
      </div>
      {isInvalid && (
        <p className="mt-1 text-xs text-red-400">
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default FormikInput;