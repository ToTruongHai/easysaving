export const calcSum = (arr: []) =>
  arr?.reduce((partialSum: any, a: any) => partialSum + parseInt(a?.cash), 0);

export const datediff = (first: any, second: any) => {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
};
export const parseDate = (str: any) => {
  var mdy = str.split("-");
  return new Date(mdy[0], mdy[1] - 1, mdy[2]);
};

export const formatDate = (date: any) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
