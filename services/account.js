import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function getListAccount(token, branch) {
  let params = `?token=${token}&branch=${branch}`;
  const url = `${ROOT_API}/api/account/list${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function getListAccountOwnerOnly(token, branch) {
  let params = `?token=${token}&branch=${branch}`;
  const url = `${ROOT_API}/api/account/list/onlyowner${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function getListAccountOwnerCustomer(token, branch) {
  let params = `?token=${token}&branch=${branch}`;
  const url = `${ROOT_API}/api/account/list/onlycustomer${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setSaveAccount(data, token) {
  const url = `${ROOT_API}/api/account/store`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}