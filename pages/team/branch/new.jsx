import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BranchContent } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { ClearRedux } from "../../../services/redux";

export default function Branch() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);

  return <BranchContent />;
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
