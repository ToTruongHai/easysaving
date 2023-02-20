import { isArray, isBoolean, isEmpty } from "lodash-es";
import { useRef } from "react";

type FieldValue = {
  [name: string | number]: () => true;
};
type FieldData = object[] | boolean | void | any;

const useRefForm = () => {
  const formRef = useRef(null);
  const dataRef = useRef({} as any);

  const setFieldsValue = (fieldValue: FieldValue) =>
    (dataRef.current = {
      ...dataRef.current,
      ...fieldValue,
    });

  const setEditedFieldValue = (formData: any) => {
    const { current = {} as any } = formRef ?? {};
    const { current: dataC = {} as any } = dataRef ?? {};

    if (current === null) return;

    dataRef.current = {
      ...dataC,
      ...formData,
    };

    const _cForm = Object.keys(current?.elements) ?? [];
    _cForm?.forEach((e: any) => {
      const item = current.elements?.[e];

      if (!isEmpty(item?.name)) {
        const getDataByName = dataRef.current?.[item?.name];
        if (getDataByName === undefined) {
          const _getDataByName = formData?.[item?.name];
          return (item.value = _getDataByName ?? "");
        }

        return (item.value = getDataByName ?? "");
      }
    });
  };

  const getFieldsValue = (fieldData: FieldData) => {
    const { current = {} as any } = dataRef ?? {};

    const isGetAll = isBoolean(fieldData) && fieldData === true;
    const isGetExist = isEmpty(fieldData);
    if (isGetAll) return current;
    if (isGetExist) {
      return console.log({ formRef });
    }

    if (isArray(fieldData))
      return fieldData?.map((fieldName: any) => {
        const findData = current?.[fieldName] ?? "";
        return {
          [fieldName as any]: findData,
        };
      });
  };

  const validating = (callBack = (isValid: boolean) => {}) => {
    const { current = {} as any } = formRef ?? {};
    const data = Object.keys(current.elements) ?? [];
    const validData = data?.map((e: any) => {
      const item = current.elements?.[e];
      item.focus();
      item.blur();
      return Object.values(item.classList).includes("border-red-500");
    });
    const isValid = validData.every((e: any) => e === false);

    if (isValid && callBack && typeof callBack === "function") {
      return callBack(isValid);
    }
    return isValid;
  };

  return {
    formRef,
    dataRef,
    setFieldsValue,
    getFieldsValue,
    validating,
    setEditedFieldValue,
  };
};

export default useRefForm;
