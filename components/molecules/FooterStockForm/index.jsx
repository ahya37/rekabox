import { Col, Row } from "react-bootstrap";

export default function FooterStockForm(props) {
  let { countDesc, data, icCount, title } = props;

  function ViewCountAudit() {
    let count = 0;
    if (data === "") {
      return <span>{count}</span>;
    }
    if (data > icCount) {
      count = data - icCount;
      return <span className="text-success">+{count}</span>;
    }
    if (data < icCount) {
      count = icCount - data;
      return <span className="text-danger">-{count}</span>;
    }
    if (data == icCount) {
      count = icCount - icCount;
      return <span>{count}</span>;
    }
  }
  function ViewCountStockIn() {
    if (data === "" || data < 0) {
      return <span>0</span>;
    } else {
      return <span className="text-success">+{data}</span>;
    }
  }
  function ViewCountStockOut() {
    if (data === "" || data < 0) {
      return <span>0</span>;
    } else {
      return <span className="text-danger">-{data}</span>;
    }
  }

  function ViewCount() {
    if (title === "Stok Saat Ini") {
      return <ViewCountAudit />;
    }
    if (title === "Stok Masuk") {
      return <ViewCountStockIn />;
    }
    if (title === "Stok Keluar") {
      return <ViewCountStockOut />;
    }
  }

  return (
    <Row>
      <Col md={4} sm={4} xs={4}>
        <h6>{countDesc}</h6>
      </Col>
      <Col md={8} sm={8} xs={8}>
        <h6 className="float-right">
          Total : <ViewCount />
        </h6>
      </Col>
    </Row>
  );
}
