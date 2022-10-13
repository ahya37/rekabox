import axios from "axios";
import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function getCity() {
  const URL = "api/cities";

  const response = await axios.get(`${ROOT_API}/${URL}`);
  const axiosResponse = response.data;

  return axiosResponse.data;
}

export async function setSaveLocation(data, token) {
  const url = `${ROOT_API}/api/location/create`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getDetailLocation(locIdx, token) {
  let params = `?all=${token}&locIdx=${locIdx}`;
  const url = `${ROOT_API}/api/location/detail/${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setUpdateLocation(data, token) {
  const url = `${ROOT_API}/api/location/update`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setDeleteLocation(data, token) {
  const url = `${ROOT_API}/api/location/delete`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}
