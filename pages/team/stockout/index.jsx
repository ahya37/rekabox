import { StockOutContent, Navbar, Sidebar, StockOutContentBasic } from "../../../components";
import { ClearRedux } from "../../../services/redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getChekAuth } from "../../../services/auth";
import { getItemByLocation } from "services/item";

export default function StokOut(props) {
  const { resultItems } = props;
  const [content, setContent] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
    const localData  = JSON.parse(localStorage.getItem('branch'));

    if (localData.br_mode === 'Basic') {
      setContent(
        <StockOutContentBasic items={resultItems} />
      )
      
    }else{
      setContent(
        <StockOutContent/>
       
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
  const { branch } = req.cookies;

  const auth = await getChekAuth(token);

  const data = {
    token: token,
  }

  const resultItems = await getItemByLocation('all', data, token, branch);


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
      resultItems: resultItems?.data.data.item
    },
  };
}
