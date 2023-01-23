import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getListItemCreateBundle } from "services/item";
import { FormEditBundle, Navbar, Sidebar } from "../../../../components";
import { getChekAuth } from "services/auth";
import { ClearRedux } from "services/redux";
import { getDetailBundle } from "services/purchase";

export default function CopyBundle(props) {
  const {detailBundle} = props;
  const submitStatus = 'copy';

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);
  return (
    <div className="wrapper">
      <Sidebar activeMenu="bundle" />
      <div id="content-page" className="content-page">
        <Navbar />
        <FormEditBundle item={detailBundle} submitStatus={submitStatus} />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req,params }) {
  const { token } = req.cookies;
  const { branch } = req.cookies;
  const idx = params.idx;

  const auth = await getChekAuth(token);
  const result = await getDetailBundle(token, branch, idx);

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
        detailBundle: result.data.data,
    },
  };
}
