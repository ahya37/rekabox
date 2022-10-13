import { CategoryContent, Navbar, Sidebar } from "../../../components";
import { getListCategory } from "../../../services/category";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ClearRedux } from "../../../services/redux";
import { getChekAuth } from "../../../services/auth";

export default function Category(props) {
  const { categories} = props;


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="category" />
      <div id="content-page" className="content-page">
        <Navbar />
        <CategoryContent data={categories} />
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

  const response = await getListCategory(token, branch);

  return {
    props: {
      categories: response.data.data.category
    },
  };
}
