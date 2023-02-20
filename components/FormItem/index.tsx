import { FIELD_TYPE } from "components/constants";
import { isEmpty, isNumber } from "lodash-es";

import React, { ReactNode, useMemo, useState } from "react";

type Validation =
  | {
      required?: { value?: boolean; message?: string };
      min?: { value?: number | boolean; message?: string };
      max?: { value?: number | boolean; message?: string };
      from?: { value?: number | boolean; message?: string };
      to?: { value?: number | boolean; message?: string };
    }
  | any;

type Props = {
  label?: string;
  children?: ReactNode;
  name?: string;
  rules?: Array<Validation>;
  className?: string;
};

const FormItem = ({ children, label, name, rules, className }: Props) => {
  const [errorField, setErrorField] = useState<Validation>();
  const rule = rules?.[0] ?? ({} as any);

  const validating = {
    required: (fieldValue: any, rules: any) => {
      const { message } = rules ?? {};
      return setErrorField((prevState: any) => ({
        ...prevState,
        required: {
          value: isEmpty(fieldValue),
          message: isEmpty(fieldValue) ? message : "",
        },
      }));
    },
    max: (fieldValue: any, rules: any) => {
      const { message, value } = rules ?? {};
      const isMaxError = fieldValue.length > value;
      return setErrorField((prevState: any) => ({
        ...prevState,
        max: {
          value: isMaxError,
          message: isMaxError ? message : "",
        },
      }));
    },
    min: (fieldValue: any, rules: any) => {
      const { message, value } = rules ?? {};
      const isMinError = fieldValue.length < value;
      return setErrorField((prevState: any) => ({
        ...prevState,
        min: {
          value: isMinError,
          message: isMinError ? message : "",
        },
      }));
    },
    from: (fieldValue: any, rules: any) => {
      if (!isNumber(parseInt(fieldValue))) return;
      const { message, value } = rules ?? {};
      const isFromError = fieldValue < value;
      return setErrorField((prevState: any) => ({
        ...prevState,
        from: {
          value: isFromError,
          message: isFromError ? message : "",
        },
      }));
    },
    to: (fieldValue: any, rules: any) => {
      if (!isNumber(parseInt(fieldValue))) return;
      const { message, value } = rules ?? {};
      const isToError = fieldValue > value;
      return setErrorField((prevState: any) => ({
        ...prevState,
        to: {
          value: isToError,
          message: isToError ? message : "",
        },
      }));
    },
  } as any;

  const handleValidation = (e: any) => {
    const { nodeName, value } = e.target ?? {};

    const handleNodeName = {
      [FIELD_TYPE?.INPUT]: () => {
        Object.keys(rule).forEach((e: any) =>
          validating?.[e]?.(value, rule?.[e])
        );
      },
      [FIELD_TYPE?.SELECT]: () => {},
    };

    return handleNodeName?.[nodeName]?.();
  };

  const _chidlren = React.Children.map(children, (el: any) => {
    return React.cloneElement(el, {
      name,
      valid: errorField,
      validation: handleValidation ?? "",
    });
  });

  const handleRenderError = useMemo(() => {
    if (isEmpty(errorField)) return;
    return Object.keys(errorField as any).map((ele: any, index) => {
      const { value, message } = errorField?.[ele] ?? {};

      return (
        <React.Fragment key={index}>
          {value && <p className="text-red-500 text-xs italic">{message}</p>}
        </React.Fragment>
      );
    });
  }, [errorField]);

  return (
    <div className={`w-full my-1 my-5 ${className}`}>
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
        {label}
      </label>
      {_chidlren}
      {handleRenderError}
    </div>
  );
};

export default FormItem;
