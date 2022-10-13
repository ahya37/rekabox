import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navbar, Sidebar, UsersContent } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { getListUsersAccount } from "../../../services/users";
import { ClearRedux } from "../../../services/redux";

export default function Users(props) {
  const { dataUsers } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="users" />
      <div id="content-page" className="content-page">
        <Navbar />
        <UsersContent data={dataUsers} />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;
  const { branch } = req.cookies;

  const auth = await getChekAuth(token);

  if (auth.error || !token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const resultUsers = await getListUsersAccount(token, branch);

  return {
    props: {
      dataUsers: resultUsers.data.data.user,
    },
  };
}
