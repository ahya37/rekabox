import { Col, Dropdown } from "react-bootstrap";

const FormSelectPartner = () => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="default" id="dropdown-basic" className="border">
        Partner
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Tidak ada partner</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#/action-1">
          <i className="fa fa-plus"></i> Tambah Partner
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FormSelectPartner;
