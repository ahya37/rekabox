import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navbar, PurchaseContent, SalesContent, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { ClearRedux } from "../../../services/redux";

export default function Purchase() {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="sales" />
      <div id="content-page" className="content-page">
        <Navbar />
        <SalesContent />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;

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
    props: {},
  };
}