import { Col, Dropdown } from "react-bootstrap";

const FormAllSelectPartner = () => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="default" id="dropdown-basic" className="border">
        Partner
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Tidak ada partner</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FormAllSelectPartner;
