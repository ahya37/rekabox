import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function getListHistories(data, token) {
  const url = `${ROOT_API}/api/inventory/histories`;

  return callAPI({
    url: url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getDetailHistory(data, token) {
  const url = `${ROOT_API}/api/inventory/histories/detail`;

  return callAPI({
    url: url,
    method: "POST",
    data,
    accessToken: token,
  });
}
