import { useEffect, useState } from "react";
import { AuditContent, Navbar, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { ClearRedux } from "../../../services/redux";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { getListItem } from "../../../services/item";
import { getLocationItemByBrIdx } from "../../../services/locationitem";


export default function Audit({dataItems,branchLocation}) {
  const { selectItemLocation } = useSelector((state) => state.itemReducer);
  const [brMode, setBrMode] = useState("");
  let items = [];
  let brlocIdx = "";

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ClearRedux());
    const dataLocal = JSON.parse(localStorage.getItem('branch'));
    setBrMode(dataLocal.br_mode);
  }, []);

  if(brMode === 'Basic'){
    items = dataItems;
    brlocIdx = branchLocation;
  }else{
    items = selectItemLocation
  }

  return (
    <div className="wrapper">
      <Sidebar activeMenu="audit" />
      <div id="content-page" className="content-page">
        <Navbar />
        <AuditContent branch={brMode} item={items} brlocIdx={brlocIdx}/>
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

  const responseItem = await getListItem(token, branch);
  const data = {
    branch,
    token
  }
  const respondeBranchLocation = await getLocationItemByBrIdx(data, token);

  return {
    props: {
      dataItems: responseItem.data.data.item,
      branchLocation: respondeBranchLocation.data.data.data
    },
  };
}
