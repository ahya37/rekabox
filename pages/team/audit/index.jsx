import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuditContent, AuditContentBasic, Navbar, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { getListItem } from "../../../services/item";
import { getLocationItemByBrIdx } from "../../../services/locationitem";
import { ClearRedux } from "../../../services/redux";


export default function Audit({ dataItems }) {
  const { selectItemLocation } = useSelector((state) => state.itemReducer);
  const [brMode, setBrMode] = useState("");

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(ClearRedux());
    const dataLocal = JSON.parse(localStorage.getItem('branch'));
    setBrMode(dataLocal.br_mode);
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="audit" />
      <div id="content-page" className="content-page">
        <Navbar />
        {
          brMode === "Lokasi" ? (
            <AuditContent item={selectItemLocation} />
          ) : (
            <AuditContentBasic item={dataItems}/>
          )
        }
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
