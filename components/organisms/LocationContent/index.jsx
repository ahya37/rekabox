import Link from "next/link";
import TableRow from "./TableRow";

export default function LocationContent(props) {
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
                  <h4 className="card-title text-primary">Lokasi</h4>
                </div>
              </div>
              <div className="col-md-2 col-sm-2">
                <Link href="/team/location/add">
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
                      <th scope="col">Nama</th>
                      <th scope="col">Deskripsi</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <TableRow
                        key={item.loc_idx}
                        loc_name={item.loc_name}
                        loc_desc={item.loc_desc}
                        loc_idx={item.loc_idx}
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
