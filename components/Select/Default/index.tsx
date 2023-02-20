import React from "react";

type Props = {
  name?: string;
  placeholder?: string;
  value?: any;
  type?: string;
  defaultValue?: string;
  validation?: (e: any) => void;
  onChange?: (e: any) => void;
  data: any;
};

const Default = ({ defaultValue, name, data, validation, onChange }: Props) => {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="block p-3 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer mb-1"
      onBlur={validation}
      onChange={onChange}
    >
      {data?.map((item: any) => {
        return (
          <option key={item?.id} value={item?.id}>
            {item?.name}
          </option>
        );
      })}
    </select>
  );
};

export default Default;
