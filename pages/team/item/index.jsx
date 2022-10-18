import { ItemContent, Navbar, Sidebar } from "../../../components";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ClearRedux } from "../../../services/redux";
import { getChekAuth } from "../../../services/auth";
import { getItemByLocation } from "services/item";
import { useState } from "react";
import { setSelectItemLocation } from "redux/action/item";

export default function Item({token, branch}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);

  const getItemApi = useCallback(async(data, token,branch) => {
    const results = await getItemByLocation('all', data, token,branch);
    dispatch(setSelectItemLocation(results?.data.data.item));
  });

  useEffect(() => {
    const data = new FormData();
    data.append('token', token);
    getItemApi(data, token, branch);
  },[])

  return (
    <div className="wrapper">
      <Sidebar activeMenu="item" />
      <div id="content-page" className="content-page">
        <Navbar />
        <ItemContent />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;
  const { branch } = req.cookies;

  const auth = await getChekAuth(token);

  if (auth.error || !token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {
      token: token,
      branch: branch
    },
  };
}
