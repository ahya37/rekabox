import { EditLocationForm, Navbar, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { getDetailLocation } from "../../../services/location";

export default function EditLocation(props) {
  const { detailLocation } = props;
  return (
    <div className="wrapper">
      <Sidebar activeMenu="location" />
      <div id="content-page" className="content-page">
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-2 col-lg-2"></div>
            <div className="col-sm-12 col-lg-12">
              <div className="iq-card">
                <div className="iq-card-header d-flex justify-content-between">
                  <div className="iq-header-title">
                    <h4 className="card-title"> Edit Lokasi</h4>
                  </div>
                </div>
                <div className="iq-card-body">
                  <EditLocationForm data={detailLocation} />
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
  const locIdx = params.locIdx;

  const auth = await getChekAuth(token);

  if (auth.error || !token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const response = await getDetailLocation(locIdx, token);

  return {
    props: {
      detailLocation: response.data.data.location,
    },
  };
}
