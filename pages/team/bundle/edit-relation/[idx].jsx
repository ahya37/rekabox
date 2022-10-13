import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getListItemCreateBundle } from "services/item";
import { FormBundle, Navbar, Sidebar, EditLinkedItem } from "../../../../components";
import { getChekAuth } from "services/auth";
import { ClearRedux } from "services/redux";
import { getDetailBundle } from "services/purchase";

export default function Bundle(props) {
  const { listItems,detail } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);
  return (
    <div className="wrapper">
      <Sidebar activeMenu="bundle" />
      <div id="content-page" className="content-page">
        <Navbar />
        <EditLinkedItem item={listItems} dataEdit={detail}/>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req,params }) {
  const { token } = req.cookies;
  const { branch } = req.cookies;
  const idx = params.idx;

  const auth = await getChekAuth(token);
  const listItems = await getListItemCreateBundle(token, branch);

  // GET ITER TERKAIT BERDASARKAN BUNDLE ID NYA
  const detail = await getDetailBundle(token, branch, idx);

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
      listItems: listItems.data.data.items,
      detail: detail.data.data.detailBundle,
    },
  };
}
