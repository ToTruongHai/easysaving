import { FIELD_TYPE, INPUT_TYPE } from "components/constants";

/* SAU NÀY NÊN ĐỔI RULE VALIDATION 
      + MIN,MAX THÀNH LENGTH
      + FROM,TO THÀNH RANGE
*/

export const formData = [
  {
    name: "name",
    type: FIELD_TYPE?.SELECT,
    valueType: INPUT_TYPE?.TEXT,
    label: "Tên Người Gửi: ",
    placeholder: "",
    defaultValue: 0,
    rules: null,
  },
  {
    name: "date",
    type: FIELD_TYPE?.DATE_PICKER,
    valueType: INPUT_TYPE?.TEXT,
    label: "Ngày Gửi: ",
    placeholder: "",
    defaultValue: 0,
    rules: null,
  },
  {
    name: "cash",
    type: FIELD_TYPE?.INPUT,
    valueType: INPUT_TYPE?.TEXT,
    label: "Số Tiền: ",
    placeholder: "Nhập số tiền",
    defaultValue: 0,
    rules: null,
  },
];

export const userData = {
  user: [
    {
      id: 0,
      name: "Lê Ngọc Tường Vy",
    },
    {
      id: 1,
      name: "Tô Trường Hải",
    },
  ],
};

export const percentage = 8.8;
