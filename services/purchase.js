import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function setSaveBundle(data, token) {
  const url = `${ROOT_API}/api/bundle/store`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setUpdateItemBundle(data, token) {
  const url = `${ROOT_API}/api/bundle/item/update`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setDeletePurchaseDetail(data, token) {
  const url = `${ROOT_API}/api/purchase/delete`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setSaveCopyBundle(data, token) {
  const url = `${ROOT_API}/api/bundle/copy`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getListBundle(token, branch) {
  let params = `?all=${token}&branch=${branch}`;
  const url = `${ROOT_API}/api/bundle/list${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setUpdateStatusPurchaseByDetail(data, token) {
  const url = `${ROOT_API}/api/purchase/detail/updatestatus`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setDeleteBundleDetail(data, token) {
  const url = `${ROOT_API}/api/bundle/delete/detail`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getDetailBundle(token, branch, ibIdx) {
  let params = `?token=${token}&ib_idx=${ibIdx}&branch=${branch}`;
  const url = `${ROOT_API}/api/bundle/detail${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setUpdateBundle(data, token) {
  const url = `${ROOT_API}/api/bundle/update`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getItemMixBundle(token, branch) {
  let params = `?token=${token}&branch=${branch}`;
  const url = `${ROOT_API}/api/itemmixbundle${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setSavePurchase(data, token) {
  const url = `${ROOT_API}/api/purchase/store`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getListPurchase(token, branch, status, selectDateRange) {
  let params = `?token=${token}&branch=${branch}&status=${status}&daterange=${selectDateRange}`;
  const url = `${ROOT_API}/api/purchase/list${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setUpdateStatusPurchase(data, token) {
  const url = `${ROOT_API}/api/purchase/update/status`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getDetailPurchase(token, branch, idx) {
  let params = `?token=${token}&branch=${branch}&pur_idx=${idx}`;
  const url = `${ROOT_API}/api/purchase/detail${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function getEditPurchase(token, branch, idx) {
  let params = `?token=${token}&branch=${branch}&pur_idx=${idx}`;
  const url = `${ROOT_API}/api/purchase/edit${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setUpdateDetailPurchase(data, token) {
  const url = `${ROOT_API}/api/purchase/update`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setDeleteBundle(data, token) {
  
}