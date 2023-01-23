import { concat } from "lodash";
import { useEffect,useState } from "react";
import { useDispatch } from "react-redux";
import { Navbar, Sidebar, StockInContent, StockInContentBasic } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { ClearRedux } from "../../../services/redux";

export default function StokIn() {
  const [content, setContent] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
    const localData  = JSON.parse(localStorage.getItem('branch'));

    if (localData.br_mode === 'Basic') {
      setContent(
        <StockInContentBasic />
      )
      
    }else{
      setContent(
        <StockInContent />
      )
    }
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="stockin" />
      <div id="content-page" className="content-page">
        <Navbar />
        {content}
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
