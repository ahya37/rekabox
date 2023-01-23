import {
  Navbar,
  Sidebar,
  StockOutMissingContent,
} from "../../../../components";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { ClearRedux } from "../../../../services/redux";
import { getChekAuth } from "../../../../services/auth";

export default function StockOutMissing() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);
  return (
    <div className="wrapper">
      <Sidebar activeMenu="stockout" />
      <div id="content-page" className="content-page">
        <Navbar />
        <StockOutMissingContent />
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
