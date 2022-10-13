import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function setSaveCatgory(data, token) {
  const url = `${ROOT_API}/api/category/create`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

// export async function getListCategory(userIdx, token) {
//   const url = `${ROOT_API}/api/category/list/useridx/${userIdx}`;

//   return callAPI({
//     url: url,
//     method: "GET",
//     accessToken: token,
//   });
// }

export async function getListCategory(token,branch) {
  let params = `?all=${token}&branch=${branch}`;
  const url = `${ROOT_API}/api/category/list${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function getDetailCategory(catIdx, token) {
  let params = `?all=${token}&cat_idx=${catIdx}`;
  const url = `${ROOT_API}/api/category/detail/${params}`;

  return callAPI({
    url: url,
    method: "GET",
    accessToken: token,
  });
}

export async function setDeleteCategory(data, token) {
  const url = `${ROOT_API}/api/category/delete`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}

export async function setUpdateCategory(data, token) {
  const url = `${ROOT_API}/api/category/update`;

  return callAPI({
    url,
    method: "POST",
    data,
    accessToken: token,
  });
}
