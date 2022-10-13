import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AccountContent, Navbar, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { ClearRedux } from "../../../services/redux";

export default function Account() {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="account" />
      <div id="content-page" className="content-page">
        <Navbar />
        <AccountContent/>
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