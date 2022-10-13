import { Navbar, Sidebar, StockInMissingContent } from "../../../../components";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { ClearRedux } from "../../../../services/redux";
import { getChekAuth } from "../../../../services/auth";

export default function StockInMissing() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);
  return (
    <div className="wrapper">
      <Sidebar activeMenu="stockin" />
      <div id="content-page" className="content-page">
        <Navbar />
        <StockInMissingContent />
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
