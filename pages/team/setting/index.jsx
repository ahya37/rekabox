import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navbar, SettingContent, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { ClearRedux } from "../../../services/redux";
import { getSetting } from "../../../services/users";

export default function Setting(props) {
  const { company, user } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);
  return (
    <div className="wrapper">
      <Sidebar />
      <div id="content-page" className="content-page">
        <Navbar />
        <SettingContent company={company} user={user} />
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

  const response = await getSetting(token);

  return {
    props: {
      company: response.data.data.company,
      user: response.data.data.user,
    },
  };
}
