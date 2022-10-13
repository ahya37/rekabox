import { Number } from "components";
import { Col, Row } from "react-bootstrap";

export default function LinkedItem({data}) {
const IMG = process.env.NEXT_PUBLIC_IMG;

  return (
      <Row>
        <Col md={12} className="mt-4"></Col>
        {data.map((m) => (
          <Col md={12} className="mb-2" key={m.id}>
            <div className="card border">
              <div className="card-body">
                <ul className="col-md-12 list-group list-group-flush">
                  <li className="list-group-item p-1">
                    <Row>
                      <Col md={1}>
                        {m.image !== "NULL" ? (
                          <img
                            src={`${IMG}/${m.image}`}
                            width="50"
                            height="50"
                            className="rounded-top rounded-bottom mr-1"
                          />
                        ) : (
                          <img
                            src="/icon/broken_image.svg"
                            width="50"
                            height="50"
                            className="rounded-top rounded-bottom"
                          />
                        )}
                      </Col>
                      <Col md={8} className="ml-4">
                        <small>
                          <i className="fa fa-barcode"></i> {m.barcode}
                        </small>
                        <br />
                        <span className="text-dark">{m.name}</span>
                        <span className="text-dark ml-2 badge bg-primary text-white float-right">
                          {m.count}
                        </span>
                        <br />
                        <small className="text-secondary">
                          <Number value={m.detail.cost} /> /{" "}
                          <Number value={m.detail.price} /> /{" "}
                          {m.detail.category}
                        </small>
                      </Col>
                    </Row>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        ))}
      </Row>
  );
}
