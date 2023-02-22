/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useMemo } from "react";
import editIcon from "../../public/icons8-pencil-64.png";
import deleteIcon from "../../public/icons8-close-window-100.png";
import aVy from "../../public/vy.jpeg";
import aHai from "../../public/hai.jpeg";

type Props = {
  data?: any;
  action: (itemId?: any, tableAction?: any) => void;
  className?: string;
};

const Table = ({ data, action, className }: Props) => {
  const renderTableData = useMemo(() => {
    return data?.map((item: any, index: any) => {
      const isVy = item?.name?.id === 0;
      return (
        <tr
          key={index}
          className={`${
            index % 2 === 0 ? "bg-gray-100" : "bg-slate-200"
          } border-b dark:bg-gray-900 dark:border-gray-700`}
        >
          <th className="px-6 py-4">
            <Image
              src={isVy ? aVy : aHai}
              alt="avatar"
              className={`border rounded-lg ${
                isVy ? "border-violet-500" : "border-green-500"
              } h-10 w-10`}
              onClick={() => action(item?.id, "EDIT")}
            />
          </th>
          <th
            scope="row"
            className={`px-6 py-4 font-medium ${
              isVy ? "text-violet-600" : "text-lime-600"
            } whitespace-nowrap dark:text-white`}
          >
            {item?.name?.name}
          </th>
          <td className="px-6 py-4"> {item?.date?.startDate}</td>
          <td className="px-6 py-4">{`${item?.hours} Giờ : ${item?.minutes} Phút`}</td>
          <td className="px-6 py-4">{`${parseInt(
            item?.cash
          )?.toLocaleString()} VND`}</td>
          <td className="px-6 py-4 ">
            <div className="flex gap-3 justtify-center item-center">
              <Image
                src={editIcon}
                alt="abc"
                className="border rounded-lg border-green-500 bg-green-200 cursor-pointer h-8 w-8"
                onClick={() => action(item?.id, "EDIT")}
              />

              <Image
                src={deleteIcon}
                alt="abc"
                className="border rounded-lg border-red-500 bg-red-200 cursor-pointer h-8 w-8"
                onClick={() => action(item?.id, "DELETE")}
              />
            </div>
          </td>
        </tr>
      );
    });
  }, [data]);

  return (
    <div
      className={`relative overflow-x-auto shadow-md sm:rounded-lg ${className}`}
    >
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3"></th>
            <th scope="col" className="px-6 py-3">
              Họ Và Tên
            </th>
            <th scope="col" className="px-6 py-3">
              Ngày Gửi <br /> (Năm - Tháng - Ngày)
            </th>
            <th scope="col" className="px-6 py-3">
              Thời Gian Gửi <br />
              (HH:MM)
            </th>
            <th scope="col" className="px-6 py-3">
              Số Tiền <br />
              (VND)
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>{renderTableData}</tbody>
      </table>
    </div>
  );
};

export default Table;
