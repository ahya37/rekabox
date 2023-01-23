import { useRouter } from "next/router";
import { Navbar, Sidebar, EditCategoryForm } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { getDetailCategory } from "../../../services/category";

export default function detailCategory(props) {
  const { detailCategory } = props;
  return (
    <div className="wrapper">
      <Sidebar activeMenu="category" />
      <div id="content-page" className="content-page">
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-2 col-lg-2"></div>
            <div className="col-sm-12 col-lg-12">
              <div className="iq-card">
                <div className="iq-card-header d-flex justify-content-between">
                  <div className="iq-header-title">
                    <h4 className="card-title"> Edit Kategori</h4>
                  </div>
                </div>
                <div className="iq-card-body">
                  <EditCategoryForm data={detailCategory} />
                </div>
              </div>
            </div>
            <div className="col-sm-2 col-lg-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, params }) {
  const { token } = req.cookies;
  const catIdx = params.catIdx;

  const auth = await getChekAuth(token);

  if (auth.error || !token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const response = await getDetailCategory(catIdx, token);

  return {
    props: {
      detailCategory: response.data.data.detailCategory,
    },
  };
}
