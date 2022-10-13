import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function getReportInventory(data, token) {
  const url = `${ROOT_API}/api/inventory/export/excel`;

  return callAPI({
    url: url,
    method: "POST",
    data,
    accessToken: token,
  });
}
