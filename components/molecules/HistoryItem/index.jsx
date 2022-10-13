import Image from "next/image";
import { Col, Row } from "react-bootstrap";

export default function HistoryItem(props) {
  const { type, date, time, qty, member, location } = props;

  function IconType(props) {
    const { status } = props;
    const typeIcon = "";
    if (status === "Stok Masuk") {
      typeIcon = "Tambah";
      return typeIcon;
    }
    if (status === "Stok Keluar") {
      typeIcon = "Keluar";
      return typeIcon;
    }
    if (status === "Audit") {
      typeIcon = "Audit";
      return typeIcon;
    }
    if (status === "Stok Pindah") {
      typeIcon = "Pindah";
      return typeIcon;
    }
  }
  function IconStock(props) {
    const { status } = props;
    if (status === "Stok Masuk") {
      return (
        <Image src="/ilustrations/arrrow-down.svg" width={30} height={20} />
      );
    }
    if (status === "Stok Keluar") {
      return <Image src="/ilustrations/arrow-up.svg" width={30} height={20} />;
    }
    if (status === "Stok Pindah") {
      return (
        <Image src="/ilustrations/arrow-right.svg" width={30} height={20} />
      );
    }
    if (status === "Audit") {
      return (
        <Image src="/ilustrations/arrows-updown2.svg" width={30} height={20} />
      );
    }
  }

  return (
    <li className="d-flex mb-4 align-items-center">
      <Col md={12}>
        <a href="#">
          <Row>
            <Col md={2} sm={2} xs={2}>
              <div className="user-img img-fluid">
                <IconStock status={type} />
              </div>
            </Col>
            <Col md={5} sm={5} xs={5}>
              <div className="user-img img-fluid">
                <div className="media-support-info">
                  {type}
                  <span className="badge border border-warning text-warning ml-1">
                    <IconType status={type} />
                  </span>
                </div>
              </div>
            </Col>
            <Col md={5} sm={5} xs={5}>
              <h6 className="float-right">
                {date} <small>{time}</small>
              </h6>
            </Col>
          </Row>
          <Row>
            <Col md={2} sm={2} xs={2}></Col>
            <Col md={6} sm={6} xs={6}>
              <div className="user-img img-fluid">
                <div className="media-support-info">Item / + {qty}</div>
              </div>
            </Col>
            <Col md={4} sm={4} xs={4}>
              <h6 className="float-right">{member}</h6>
            </Col>
          </Row>
          <Row>
            <Col md={2} sm={2} xs={2}></Col>
            <Col md={1} sm={1} xs={1}>
              <span className="badge badge-pill badge-light">Ke</span>
            </Col>
            <Col md={5} sm={5} xs={5}>
              <h6>{location}</h6>
            </Col>
          </Row>
        </a>
      </Col>
    </li>
  );
}
