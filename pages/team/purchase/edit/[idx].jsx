import { FormEditPurchase, Navbar, Sidebar } from "components";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setEditDataPurchase } from "redux/action/purchase";
import { getChekAuth } from "services/auth";
import { getDetailPurchase, getEditPurchase } from "services/purchase";
import { ClearRedux } from "services/redux";

export default function EditPurchase(props) {
  const { idx, purchase, dataItem, dataBundle} = props;
  const dispatch      = useDispatch();

  useEffect(() => {
    dispatch(ClearRedux());
    dispatch(setEditDataPurchase(dataItem));
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="bundle" />
      <div id="content-page" className="content-page">
        <Navbar />
        <FormEditPurchase idx={idx} purchase={purchase} bundle={dataBundle} />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, params }) {
  const { token } = req.cookies;
  const { branch } = req.cookies;
  const idx = params.idx;

  const auth = await getChekAuth(token);
  const detailPurchase = await getDetailPurchase(token, branch, idx);
  const editPurchase   = await getEditPurchase(token, branch, idx);

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
      purchase: detailPurchase?.data.data.purchase,
      dataItem: editPurchase?.data.data.detailData,
      dataBundle : editPurchase?.data.data.bundle
    },
  };
}
