import { ItemContent, Navbar, Sidebar } from "../../../components";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ClearRedux } from "../../../services/redux";
import { getChekAuth } from "../../../services/auth";

export default function Item() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="item" />
      <div id="content-page" className="content-page">
        <Navbar />
        <ItemContent />
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
