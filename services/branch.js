import callAPI from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;


export async function getAllBranch(token) {
    const url = `${ROOT_API}/api/branch`;
  
    return callAPI({
      url: url,
      method: "GET",
      accessToken: token,
    });
  }

  export async function setSaveBranch(data, token) {
    const url = `${ROOT_API}/api/branch/save`;

    return callAPI({
      url,
      method: "POST",
      data,
      accessToken: token,
    });
  }

  export async function getBranchById(data, token) {
    const url = `${ROOT_API}/api/branch/id`;

    return callAPI({
      url,
      method: "POST",
      data,
      accessToken: token,
    });
  }
  