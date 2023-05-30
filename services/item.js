import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function setSaveItem(data, token) {
  const url = `${ROOT_API}/api/item/create`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}
export async function setUpdateItem(data, token) {
  const url = `${ROOT_API}/api/item/update`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getListItem(token,branch) {
  let params = `?all=${token}&branch=${branch}`;
  const url = `${ROOT_API}/api/item/list${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function getItemByLocation(locIdx, data, token,branch) {
  let params = `?lc_loidx=${locIdx}&branch=${branch}`;
  const url = `${ROOT_API}/api/item/bylocation${params}`;

  return callAPI({
    url: url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setSaveStockInItem(data, token) {
  const url = `${ROOT_API}/api/item/stockin`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setSaveStockAuditItem(data, token) {
  const url = `${ROOT_API}/api/item/stockaudit`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getLocationByItem(it_idx, data, token) {
  let params = `?it_idx=${it_idx}`;
  const url = `${ROOT_API}/api/item/location${params}`;

  return callAPI({
    url: url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getDetailItem(idx, token) {
  let params = `?token=${token}`;
  const url = `${ROOT_API}/api/item/detail/${idx}${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function getHistoryByLocation(lc_idx, idx, lc_loidx, data, token) {
  let params = `?lc_idx=${lc_idx}&it_idx=${idx}&loc_idx=${lc_loidx}`;
  const url = `${ROOT_API}/api/inventory/location/history${params}`;

  return callAPI({
    url: url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getDetailHistoryByLocation(
  lc_itidx,
  lc_loidx,
  data,
  token
) {
  let params = `?it_idx=${lc_itidx}&loc_idx=${lc_loidx}`;
  const url = `${ROOT_API}/api/inventory/location/history/detail${params}`;

  return callAPI({
    url: url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getEditItem(idx, token) {
  let params = `?idx=${idx}&token=${token}`;
  const url = `${ROOT_API}/api/item/edit/${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setDeleteItem(dataDelete, tokenDelete) {
  const url = `${ROOT_API}/api/item/delete`;

  return callAPI({
    url,
    method: "POST",
    data: dataDelete,
    accessToken: tokenDelete,
  });
}

export async function setSaveCopyItem(data, token) {
  const url = `${ROOT_API}/api/item/copy`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setSaveMoveItem(data, token) {
  const url = `${ROOT_API}/api/item/stocmove`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setSaveStockMissingItem(data, token) {
  const url = `${ROOT_API}/api/item/stockmissing`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getListItemCreateBundle(token,branch) {
  let params = `?all=${token}&branch=${branch}`;
  const url = `${ROOT_API}/api/item/create/bundle${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setReturItemStockOut(data, token) {
  const url = `${ROOT_API}/api/item/retur/stockout/store`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setReturItemStockIn(data, token) {
  const url = `${ROOT_API}/api/item/retur/stockin/store`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}