import { Col } from "react-bootstrap";
import Company from "./Company";
import UserProfile from "./UserProfile";

export default function SettingContent(props) {
  const { company, user } = props;

  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="iq-card-body">
          <div className="col-md-12 col-sm-12">
            <div className="iq-card">
              <div className="iq-header-title">
                <Col md={12}>
                  <h4 className="card-title mb-4">Pengaturan</h4>
                </Col>
              </div>
              <Company data={company} />
              <div className="mt-4"></div>
              <UserProfile data={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
