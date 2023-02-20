import React from "react";

type Props = {
  name?: string;
  placeholder?: string;
  value?: any;
  type?: string;
  valid?: {
    required: { value: boolean };
    min: { value: boolean };
    max: { value: boolean };
    from: { value: boolean };
    to: { value: boolean };
  };
  validation?: (e: any) => void;
  onBlur?: (e: any) => void;
  pattern?: string;
};

const Input = ({
  name,
  placeholder,
  valid,
  validation,
  value,
  type,
  onBlur,
  pattern,
}: Props) => {
  const { required, min, max, from, to } = valid ?? {};

  const flag =
    required?.value || min?.value || max?.value || from?.value || to?.value;

  return (
    <input
      className={`appearance-none block w-full bg-gray-200 text-gray-700
       ${flag ? "border  border-red-500" : ""} 
        rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
      type={type}
      name={name}
      placeholder={placeholder}
      onBlur={validation || onBlur}
      value={value}
      pattern={pattern}
    />
  );
};

export default Input;
