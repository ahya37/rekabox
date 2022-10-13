import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navbar, Sidebar, StockInContent } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { ClearRedux } from "../../../services/redux";

export default function StokIn() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);
  return (
    <div className="wrapper">
      <Sidebar activeMenu="stockin" />
      <div id="content-page" className="content-page">
        <Navbar />
        <StockInContent />
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
