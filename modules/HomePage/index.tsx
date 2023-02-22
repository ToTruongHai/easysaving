import { FIELD_TYPE } from "@/components/constants";
import DateInput from "@/components/DateInput";
import Form from "@/components/Form";
import FormItem from "@/components/FormItem";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TimeInput from "@/components/TimeInput";
import useRefForm from "@/hooks/useRefForm";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { FetchAPI } from "@/services/FetchService";
import { isEmpty, isNaN, isNumber, isString } from "lodash-es";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { formData, percentage, userData } from "./constants";

type User = {
  id: number;
  name: string;
};

const ROOT = "https://api.jsonbin.io/v3/b/";
// const USER_BIN = "63eb025fc0e7653a0577034f";
const TABLE_BIN = "63eb060aebd26539d07dc709";

const HomePage = () => {
  const { width = 0 } = useWindowDimensions() ?? {};
  const form = useRefForm();
  const currentDate = new Date();
  const defaultValue = {
    name: 0,
    cash: parseInt("3000000").toLocaleString(),
    date: {
      endDate: `${currentDate?.getFullYear()}-${
        currentDate?.getMonth() + 1
      }-${currentDate?.getDate()}`,
      startDate: `${currentDate?.getFullYear()}-${
        currentDate?.getMonth() + 1
      }-${currentDate?.getDate()}`,
    },
    hours: currentDate?.getHours()?.toString(),
    minutes: currentDate?.getMinutes()?.toString(),
  };
  const [selectUser, setSelectUser] = useState<User[]>(userData?.user);
  const [tableSaving, setTableSaving] = useState<any>();
  const [date, setDate] = useState({
    startDate: currentDate,
    endDate: currentDate,
  } as any);
  const [loading, setLoading] = useState<boolean>(false);

  // const getCategoryOption = async () => {
  //   return await FetchAPI(
  //     {
  //       url: `${ROOT}${USER_BIN}`,
  //       input: {},
  //       method: "GET",
  //     },
  //     async (res, status) => {
  //       const data = (await res.json()) ?? {};
  //       return unstable_batchedUpdates(() => {
  //         setSelectUser(data.record.user);
  //         form.setEditedFieldValue({
  //           cash: parseInt("3000000").toLocaleString(),
  //         });
  //       });
  //     }
  //   ).catch((error) => {
  //     console.error("Error:", error);
  //   });
  // };

  const getTableAPI = async () => {
    setLoading(true);

    return await FetchAPI(
      {
        url: `${ROOT}${TABLE_BIN}`,
        input: {},
        method: "GET",
      },
      async (res, status) => {
        const data = (await res.json()) ?? {};
        const tableSaving = data?.record.tableSaving ?? [];
        const _tableSaving = tableSaving?.sort(
          (firstValue: any, secondValue: any) =>
            secondValue?.id - firstValue?.id
        );

        return unstable_batchedUpdates(() => {
          setTableSaving(_tableSaving);
          setLoading(false);
        });
      }
    ).catch((error) => {
      console.error("Error:", error);
    });
  };

  const setTableAPI = async (data: any) => {
    return await FetchAPI({
      url: `${ROOT}${TABLE_BIN}`,
      input: data,
      method: "PUT",
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  const deleteTableData = async (id: any) => {
    const data = tableSaving?.filter((e: any) => e?.id !== id) ?? [];
    const _data = data?.sort(
      (firstValue: any, secondValue: any) => secondValue?.id - firstValue?.id
    );
    setLoading(true);
    await FetchAPI(
      {
        url: `${ROOT}${TABLE_BIN}`,
        input: { tableSaving: _data },
        method: "PUT",
      },
      () => {
        setLoading(false);
      }
    ).catch((error) => {
      console.error("Error:", error);
    });
    return setTableSaving(_data);
  };

  useEffect(() => {
    // getCategoryOption();
    getTableAPI();
  }, []);

  const renderFormField = () => {
    return formData?.map((item, index) => {
      const handleFormItem = {
        // TYPE INPUT
        [FIELD_TYPE?.INPUT]: (data: any) => {
          const isCash = data?.name === "cash";

          return (
            <FormItem
              label={data?.label}
              name={data?.name}
              rules={[data?.rules]}
              key={index}
            >
              <Input
                type={data?.valueType}
                placeholder={data?.placeholder}
                pattern={isCash ? `^[0-9.,\b]+$` : ""}
              />
            </FormItem>
          );
        },
        // TYPE SELECT
        [FIELD_TYPE?.SELECT]: (data: any) => {
          return (
            <FormItem
              name={data?.name}
              label={data?.label}
              rules={[data?.rules]}
              key={index}
            >
              <Select.Default data={selectUser} />
            </FormItem>
          );
        },
        // TYPE PICKER
        [FIELD_TYPE?.DATE_PICKER]: (data: any) => {
          const handleDateChange = (newDate: any) => {
            form.setFieldsValue({
              date: newDate,
            });
            return setDate({
              startDate: new Date(newDate?.startDate),
              endDate: new Date(newDate?.endDate),
            });
          };

          return (
            <div className="grid grid-cols-3 gap-4">
              <FormItem
                className="col-span-2"
                name={data?.name}
                label={data?.label}
                rules={[data?.rules]}
                key={index}
              >
                <DateInput value={date} handleValueChange={handleDateChange} />
              </FormItem>
              <TimeInput
                defaultHours={date?.startDate?.getHours().toString()}
                defaultMinutes={date?.startDate?.getMinutes().toString()}
              />
            </div>
          );
        },
      };

      return (
        <React.Fragment key={index}>
          {handleFormItem?.[item?.type]?.(item)}
        </React.Fragment>
      );
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const _form = form?.getFieldsValue(true);
    const lastId = tableSaving?.[0]?.id ?? 0;
    const input = {
      ..._form,
      cash: _form?.cash?.replaceAll(",", ""),
      name: selectUser?.find((e) => e.id === parseInt(_form?.name)),
      id: lastId + 1 ?? 0,
    };

    const data = [input, ...tableSaving];

    return unstable_batchedUpdates(() => {
      setTableSaving(data);
      setTableAPI({ tableSaving: data });
    });
  };

  const handleFormDataChange = (e: any) => {
    const { value, name } = e.target ?? {};
    const isCash = name === "cash";

    if (name === "name") {
      const is0 = selectUser?.[value]?.id === 0;
      setDate(currentDate);
      return form?.setEditedFieldValue({
        [name]: value,
        hours: currentDate?.getHours().toString(),
        minutes: currentDate?.getMinutes().toString(),
        cash: parseInt(`${is0 ? "3000000" : "5000000"}`).toLocaleString(),
      });
    }
    if (isCash) {
      const _value = value?.toString()?.replaceAll(",", "");
      const __value = parseInt(_value).toLocaleString();
      if (_value === "." || isNaN(+_value)) return;
      if (isEmpty(_value))
        return form?.setEditedFieldValue({
          cash: 0,
        });
      return form?.setEditedFieldValue({
        cash: __value,
      });
    }
    form.setFieldsValue({
      [name]: value,
    });
  };

  const renderForm = () => {
    return (
      <div className="w-11/12">
        <Form
          form={form}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 rounded-lg"
          onSubmit={handleSubmit}
          onChange={handleFormDataChange}
          defaultValue={defaultValue}
        >
          {renderFormField()}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5"
              type="submit"
            >
              Gửi Tiền
            </button>
          </div>
        </Form>
      </div>
    );
  };

  const handleTableAction = (itemId: any, tableAction: any) => {
    const handleAction = {
      EDIT: (id: any) => {
        console.log({ id, tableAction });
      },
      DELETE: (id: any) => deleteTableData(id),
    } as any;

    return handleAction?.[tableAction]?.(itemId) ?? {};
  };

  const getSumCash = tableSaving?.reduce(
    (partialSum: any, a: any) => partialSum + parseInt(a?.cash),
    0
  );
  const getPercentage = (getSumCash * (percentage / 12) * 12) / 100;

  const renderSumCash = () => getSumCash?.toLocaleString();
  const renderExtra = () => getPercentage.toLocaleString();

  const datediff = (first: any, second: any) => {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  };
  const parseDate = (str: any) => {
    var mdy = str.split("-");
    return new Date(mdy[0], mdy[1] - 1, mdy[2]);
  };
  const formatDate = (date: any) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  let total = 0;

  const renderExtraCurrency = ({ tableSaving = [] as any }: any) => {
    let tempDate = "";
    tableSaving?.forEach((item: any) => {
      if (tempDate === "") {
        tempDate = item?.date?.startDate;
        const otherDate = tableSaving?.filter(
          (e: any) => e?.date?.startDate !== tempDate
        );

        const sameDate = tableSaving?.filter(
          (e: any) => e?.date?.startDate === tempDate
        );

        const cash = sameDate?.reduce(
          (partialSum: any, a: any) => partialSum + parseInt(a?.cash),
          0
        );
        const dateCash = (cash * (percentage / 12) * 12) / 100;

        const worthDate = datediff(
          parseDate(tempDate),
          parseDate(formatDate(new Date()))
        );

        total += (worthDate * dateCash) / 365;

        if (!isEmpty(otherDate))
          return renderExtraCurrency({ tableSaving: otherDate });
      }
      if (tempDate === item?.date?.startDate) return;
    });

    return total.toLocaleString();
  };

  const renderSum = (id: any) => {
    const _vy = tableSaving?.filter((e: any) => e.name.id === id);
    return _vy
      ?.reduce((partialSum: any, a: any) => partialSum + parseInt(a?.cash), 0)
      .toLocaleString();
  };

  const renderSummary = () => {
    return (
      <div className="flex w-full justify-between gap-5">
        {/* LEFT */}
        <div className="py-5 text-violet-600 lg:text-xl md:text-lg sm:text-sm font-semibold">
          <div className="flex justify-between gap-3 whitespace-nowrap">
            Tổng của Vy: <span className="text-lime-600">{renderSum(0)} đ</span>
          </div>
          <div className="flex justify-between gap-3 whitespace-nowrap">
            Tổng của Hải:{" "}
            <span className="text-lime-600">{renderSum(1)} đ</span>
          </div>
          <div className="flex justify-between gap-3 whitespace-nowrap">
            Tổng Tiền Gửi:{" "}
            <span className="text-lime-600 whitespace-nowrap">
              {renderSumCash()} đ
            </span>
          </div>
        </div>
        {/* RIGHT */}
        <div className="py-5 text-violet-600 lg:text-xl md:text-lg sm:text-sm font-semibold">
          <div className="flex justify-between gap-3 whitespace-nowrap">
            Ngày Đáo Hạn:{" "}
            <span className="text-lime-600 whitespace-nowrap">
              {" "}
              13 / 2 / 2024
            </span>
          </div>
          <div className="flex justify-between gap-3 whitespace-nowrap">
            Lãi Tạm Tính ({percentage}%):{" "}
            <span className="text-lime-600 whitespace-nowrap">
              {renderExtra()} đ
            </span>
          </div>
          <div className="flex justify-between gap-3 whitespace-nowrap">
            Lãi Hiện Có:{" "}
            <span className="text-lime-600 whitespace-nowrap">
              {renderExtraCurrency({ tableSaving })} đ
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-4 lg:pl-3 md:pl-0 md:grid-cols-2 sm:grid-cols-1">
        {loading && (
          <div className="fixed w-full bg-teal-400 flex item-center justify-center col-span-3 py-20">
            <h3 className="text-violet-600 text-2xl font-semibold">
              Loading ...
            </h3>
          </div>
        )}

        <div
          className={`Left lg:col-span-2 md:col-span-1 items-end ${
            loading && "invisible"
          } flex flex-col `}
        >
          {renderSummary()}
          <Table
            className="w-full "
            data={tableSaving}
            action={handleTableAction}
          />
        </div>
        <div
          style={{ gridRow: `${width > 768 ? "auto" : "1"}` }}
          className={`Right flex justify-center ${loading && "invisible"}`}
        >
          {renderForm()}
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(HomePage), {
  ssr: false,
});
