import { LocationContent, Navbar, Sidebar } from "../../../components";
import { getListLocationItem } from "../../../services/locationitem";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ClearRedux } from "../../../services/redux";
import { getChekAuth } from "../../../services/auth";

export default function Location(props) {
  const { location } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="location" />
      <div id="content-page" className="content-page">
        <Navbar />
        <LocationContent data={location} />
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

  const response = await getListLocationItem(token,branch);
  return {
    props: {
      location: response.data.data.location,
    },
  };
}
