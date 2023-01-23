import axios from "axios";
import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;
const ROOT_IMG = process.env.NEXT_PUBLIC_IMG;

export async function setSignUp(data) {
  const url = `${ROOT_API}/api/register`;
  return callAPI({
    url,
    method: "POST",
    data,
  });
}

export async function setVerifyOtp(data) {
  const url = `${ROOT_API}/api/verify`;

  return callAPI({
    url,
    method: "POST",
    data,
  });
}

export async function setSaveCompany(data) {
  const url = `${ROOT_API}/api/company/create`;

  return callAPI({
    url,
    method: "POST",
    data,
  });
}

export async function setLogout(data, token) {
  const url = `${ROOT_API}/api/logout`;
  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setLogin(data) {
  const url = `${ROOT_API}/api/login`;

  return callAPI({
    url,
    method: "POST",
    data,
  });
}

export async function setGoHome(data) {
  const url = `${ROOT_API}/api/home`;

  return callAPI({
    url,
    method: "POST",
    data,
  });
}

export async function getChekAuth(token) {
  let params = `?token=${token}`;
  const url = `${ROOT_API}/api/user/checkauth${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function getAvatar(storage) {
  const response = await axios.get(`${ROOT_API}/${storage}`);
  return response;
}
