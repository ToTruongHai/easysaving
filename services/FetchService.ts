import { isEmpty } from "lodash-es";

export const FetchAPI = async (
  { url = "", input = {}, method = "GET", rest = {} },
  callBack = (res?: any, status?: any) => {}
) => {
  const isPOST = method === "POST" || method === "PUT";
  const isLoading = true;

  const response = await fetch(url, {
    method: method,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2b$10$56GUWduVWWVKiRHgfJTjreVmEt9HDjfvGOfyl.p8w4lxgqLoeDPl6",
      "X-Access-Key":
        "$2b$10$/O0liQUQE2h5ZMn2cDlge.zgdd38Prql9HBaaDM427tr/yz1XB4Ge",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    ...(isPOST && { body: JSON.stringify(input) }),

    ...rest,
  });

  if (isEmpty(callBack) && callBack && typeof callBack === "function") {
    return callBack(response, response?.status);
  }

  return response.json();
};
