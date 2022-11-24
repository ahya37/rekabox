import { StockOutContent, Navbar, Sidebar, StockOutContentBasic } from "../../../components";
import { ClearRedux } from "../../../services/redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getChekAuth } from "../../../services/auth";

export default function StokOut() {
  const [content, setContent] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
    const localData  = JSON.parse(localStorage.getItem('branch'));

    if (localData.br_mode === 'Basic') {
      setContent(
        <StockOutContentBasic />
      )
      
    }else{
      setContent(
        <StockOutContent />
       
      )
    }

  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="stockout" />
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
