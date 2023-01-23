import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function setSaveSales(data, token) {
  const url = `${ROOT_API}/api/sales/store`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}


export async function getListSales(token, branch, status, selectDateRange) {
  let params = `?token=${token}&branch=${branch}&status=${status}&daterange=${selectDateRange}`;
  const url = `${ROOT_API}/api/sales/list${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setSaveAllStockOutSales(data, token) {
  const url = `${ROOT_API}/api/sales/update/status`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getDetailSales(token, branch, idx) {
  let params = `?token=${token}&branch=${branch}&sal_idx=${idx}`;
  const url = `${ROOT_API}/api/sales/detail${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function getEditSales(token, branch, idx) {
  let params = `?token=${token}&branch=${branch}&sal_idx=${idx}`;
  const url = `${ROOT_API}/api/sales/edit${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setDeleteSalesDetail(data, token) {
  const url = `${ROOT_API}/api/sales/delete`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setUpdateDetailSales(data, token) {
  const url = `${ROOT_API}/api/sales/update`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}