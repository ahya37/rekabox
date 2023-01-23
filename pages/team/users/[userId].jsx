import { EditUserForm, Navbar, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { getDetailUser } from "../../../services/users";

export default function Detail(props) {
  const { user } = props;

  return (
    <div className="wrapper">
      <Sidebar activeMenu="users" />
      <div id="content-page" className="content-page">
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-2 col-lg-2"></div>
            <div className="col-sm-12 col-lg-12">
              <div className="iq-card">
                <div className="iq-card-header d-flex justify-content-between">
                  <div className="iq-header-title">
                    <h4 className="card-title"> Edit Pengguna</h4>
                  </div>
                </div>
                <div className="iq-card-body">
                  <EditUserForm data={user} />
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
  const userId = params.userId;
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

  const result = await getDetailUser(userId, token);

  return {
    props: {
      user: result.data.data.user,
    },
  };
}
