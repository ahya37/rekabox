import axios from "axios";

export default async function callAPI({ url, method, data, accessToken }) {
  let headers = {};
  if (accessToken) {
    headers = {
      Authorization: `Bearer ${accessToken}`,
    };
  }
  const response = await axios({
    url,
    method,
    data,
    headers: headers,
  }).catch((err) => err.response);

  if (response.status > 300) {
    const res = {
      error: true,
      message: response.data.data.message,
      data: null,
    };
    return res;
  }

  const { length } = Object.keys(response.data);
  const res = {
    error: false,
    message: null,
    data: length > 1 ? response.data : response.data.data,
  };
  return res;
}
