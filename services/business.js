import axios from "axios";
import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function getListBusiness() {
  const URL = "api/listbusiness";

  const response = await axios.get(`${ROOT_API}/${URL}`);
  const axiosResponse = response.data;

  return axiosResponse.data;
}

export async function setSaveUserMemberInfo(data) {
  const url = `${ROOT_API}/api/info`;

  return callAPI({
    url,
    method: "POST",
    data,
  });
}

export async function setSaveBusiness(data, token) {
  const url = `${ROOT_API}/api/business/store`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}
