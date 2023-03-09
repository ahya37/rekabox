import { Fragment } from "react";
import { AddItemForm, AddItemFormBasic, Navbar, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ClearRedux } from "services/redux";

export default function AddItem() {
  const [content, setContent] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ClearRedux());
    const localData  = JSON.parse(localStorage.getItem('branch'));

    if (localData.br_mode === 'Basic') {
      setContent(
        <AddItemFormBasic />
      )
      
    }else{
      setContent(
        <AddItemForm />
      )
    }
  }, []);
  return (
    <Fragment>
      <div className="wrapper">
        <Sidebar activeMenu="item" />
        <div id="content-page" className="content-page">
          <Navbar />
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-2 col-lg-2"></div>
              <div className="col-sm-12 col-lg-12">
                <div className="iq-card">
                  <div className="iq-card-header d-flex justify-content-between">
                    <div className="iq-header-title">
                      <h4 className="card-title"> Tambah Item</h4>
                    </div>
                  </div>
                  <div className="iq-card-body">
                    {content}
                  </div>
                </div>
              </div>
              <div className="col-sm-2 col-lg-2"></div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
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
