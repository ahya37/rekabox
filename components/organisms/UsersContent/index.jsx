import Link from "next/link";
import TableRow from "./TableRow";

export default function UsersContent(props) {
  const { data } = props;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="iq-card">
            <div className="iq-card-header d-flex justify-content-between">
              <div className="col-md-10 col-sm-10">
                <div className="iq-header-title">
                <span>Data Center</span>
                  <h4 className="card-title text-primary">Pengguna</h4>
                </div>
              </div>
              <div className="col-md-2 col-sm-2">
                <Link href="/team/users/add">
                  <a className="btn btn-primary float-right">
                    <i className="fa fa-plus" aria-hidden="true"></i>
                    Tambah
                  </a>
                </Link>
              </div>
            </div>
            <div className="iq-card-body">
              <div className="table-responsive">
                <table className="table table-hover col-md-12">
                  <thead>
                    <tr>
                      <th scope="col">Foto</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Telepon</th>
                      <th scope="col">Email</th>
                      <th scope="col">Level</th>
                      <th scope="col">Status</th>
                      <th scope="col">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user) => (
                      <TableRow
                        key={user.user_id}
                        level={user.level_name}
                        email={user.user_email}
                        fullName={user.user_fullname}
                        userId={user.user_id}
                        phone={user.user_phone}
                        image={user.user_image}
                        status={user.user_status}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
