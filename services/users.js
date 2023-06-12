import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function getListUsers(token) {
  let params = `?all=${token}`;
  const url = `${ROOT_API}/api/user/option/list${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function getMenu(token,branch) {
  let params = `?branch=${branch}`;
  const url = `${ROOT_API}/api/getmenu${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}
export async function getSetting(token) {
  const url = `${ROOT_API}/api/user/setting`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setUpdateCompany(data, token) {
  const url = `${ROOT_API}/api/user/company/update`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setUpdateProfileUser(data, token) {
  const url = `${ROOT_API}/api/user/profile/update`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getMyprofile(token) {
  const url = `${ROOT_API}/api/user/profile`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setSaveUsers(data, token) {
  const url = `${ROOT_API}/api/user/create`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getListUsersAccount(token,branch) {
  let params = `?token=${token}&branch=${branch}`;
  const url = `${ROOT_API}/api/user/listusers/${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setDeleteUser(data, token) {
  const url = `${ROOT_API}/api/user/delete`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function getDetailUser(userId, token) {
  let params = `?userid=${userId}&token=${token}`;
  const url = `${ROOT_API}/api/user/detail${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setUpdateUsers(data, token) {
  const url = `${ROOT_API}/api/user/update`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setUpdateStatusUsers(data, token) {
  const url = `${ROOT_API}/api/user/setstatus`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}
