import {FormEditSales, Navbar, Sidebar } from "components";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditDataPurchase } from "redux/action/purchase";
import { setEditDataSales } from "redux/action/sales";
import { getChekAuth } from "services/auth";
import { getDetailPurchase, getEditPurchase } from "services/purchase";
import { ClearRedux } from "services/redux";
import { getDetailSales, getEditSales } from "services/sales";

export default function EditSales(props) {
  const { idx, dataItem, dataBundle, sales} = props;
  const dispatch      = useDispatch();

  useEffect(() => {
    dispatch(ClearRedux());
    dispatch(setEditDataSales(dataItem));
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="bundle" />
      <div id="content-page" className="content-page">
        <Navbar />
        <FormEditSales idx={idx} sales={sales} bundle={dataBundle} />
        {/* <FormEditSales idx={idx} purchase={purchase} bundle={dataBundle} /> */}
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, params }) {
  const { token }  = req.cookies;
  const { branch } = req.cookies;
  const idx = params.idx;

  const auth = await getChekAuth(token);
  // const detailPurchase = await getDetailPurchase(token, branch, idx);
  // const detailSales    = await getDetailSales(token, branch, idx);
  // const editPurchase   = await getEditPurchase(token, branch, idx);
  const editSales      = await getEditSales(token, branch, idx);

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
      idx: idx,
      sales: editSales?.data.data.sales,
      dataItem: editSales?.data.data.detailData,
      dataBundle : editSales?.data.data.bundle
    },
  };
}
