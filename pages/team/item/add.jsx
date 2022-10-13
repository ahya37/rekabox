import { Fragment } from "react";
import { AddItemForm, Navbar, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";

export default function AddItem() {
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
                    <AddItemForm />
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
