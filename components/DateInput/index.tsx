import React from "react";
import Datepicker from "react-tailwindcss-datepicker";

const DateInput = ({ handleValueChange, value }: any) => {
  return (
    <Datepicker
      inputClassName={"bg-white rounded-lg shadow-inner drop-shadow-lg"}
      primaryColor={"teal"}
      useRange={false}
      asSingle={true}
      value={value}
      onChange={handleValueChange}
    />
  );
};

export default DateInput;
