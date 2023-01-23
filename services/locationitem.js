import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function getListLocationItem(token,branch) {
  let params = `?all=${token}&branch=${branch}`;
  const url = `${ROOT_API}/api/location/list${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function getLocationItem(token,branch) {
  let params = `?all=${token}&branch=${branch}`;
  const url = `${ROOT_API}/api/location/item/list${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}


export async function getLocationItemByBrIdx(data, token) {
  const url = `${ROOT_API}/api/location/branchid`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}