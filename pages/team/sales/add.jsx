import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSelectItemMixBundle } from "redux/action/item";
import { getChekAuth } from "services/auth";
import { getItemMixBundle } from "services/purchase";
import { ClearRedux } from "services/redux";
import { FormPurchaseAndSales, Navbar, Sidebar } from "../../../components";

export default function AddPurchase(props) {
  const { items } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
    dispatch(setSelectItemMixBundle(items));
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="bundle" />
      <div id="content-page" className="content-page">
        <Navbar />
        <FormPurchaseAndSales items={items} type="sales" />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;
  const { branch } = req.cookies;

  const auth = await getChekAuth(token);
  const listItems = await getItemMixBundle(token, branch);

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
      items: listItems.data.data.items,
    },
  };
}
