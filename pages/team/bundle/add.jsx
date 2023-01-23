import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getListItemCreateBundle } from "services/item";
import { FormBundle, Navbar, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { ClearRedux } from "../../../services/redux";

export default function AddBundle(props) {
  const {listItems} = props;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);
  return (
    <div className="wrapper">
      <Sidebar activeMenu="bundle" />
      <div id="content-page" className="content-page">
        <Navbar />
        <FormBundle item={listItems} />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;
  const { branch } = req.cookies;

  const auth = await getChekAuth(token);
  const listItems = await getListItemCreateBundle(token, branch);

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
      listItems : listItems.data.data.items
    },
  };
}
