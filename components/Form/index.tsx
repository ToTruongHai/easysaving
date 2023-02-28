import { isEmpty } from "lodash-es";
import React, { ReactNode, useEffect, useRef } from "react";

type Props = {
  form?:
    | {
        formRef: React.LegacyRef<HTMLFormElement>;
        dataRef: React.RefObject<HTMLFormElement>;
      }
    | any;
  onSubmit?: (e: any) => void;
  onChange?: (e: any) => void;
  className?: string;
  children?: ReactNode;
  defaultValue?: {};
};

const Form = ({
  form,
  onSubmit,
  onChange,
  className,
  children,
  defaultValue,
}: Props) => {
  const _chidlren = React.Children.map(children, (el: any) => {
    return React.cloneElement(el, {
      //Send props to child here
    });
  });

  const setDefaultsValue = (fieldValue: any) => {
    const { current: cData } = form?.dataRef ?? {};
    const { current: cForm = {} as any } = form?.formRef ?? {};

    if (!isEmpty(cData) || cForm === null) return;
    form.dataRef.current = {
      ...cData,
      ...fieldValue,
    };

    const _cForm = Object.keys(cForm?.elements) ?? [];

    _cForm?.forEach((e: any) => {
      const item = cForm.elements?.[e];
      if (!isEmpty(item?.name)) {
        const getDataByName = fieldValue?.[item?.name];
        item.value = getDataByName ?? "";
      }
    });
  };

  useEffect(() => {
    if (isEmpty(defaultValue)) return;

    setDefaultsValue(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, form, form?.formRef, form?.formRef.current]);

  return (
    <form
      ref={form?.formRef}
      className={`${className}`}
      onSubmit={onSubmit}
      onChange={onChange}
    >
      {_chidlren}
    </form>
  );
};

export default Form;
