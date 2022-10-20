import { useState } from "react";
import { useDispatch } from "react-redux";
import { setDetailItem } from "redux/action/item";
import { Button, Col, Row, Spinner } from "react-bootstrap";

export default function StockOutForm(props) {
  const [color, setColor] = useState("card shadow");
  const IMG = process.env.NEXT_PUBLIC_IMG;
  const { item, brMode } = props;

  const dispatch = useDispatch();

  const onSelected = (row, e) => {
    dispatch(setDetailItem(row))
  };

  if (props.item.length === 0) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              {brMode === 'Basic' ? (
                <h6 className="text-center">Tidak ada item</h6>
              ) : (
                <h6 className="text-center">Pilih lokasi terlebih dulu</h6>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Row>
      {item.map((row) => (
        <Col style={{ cursor: "pointer" }} md={12} onClick={(e) => onSelected(row, e)} key={row.it_idx}>
          <ul className="col-md-12 list-group list-group-flush border-bottom">
            <li className="list-group-item p-1">
              <Row>
                <Col md={2}>
                  {row.it_image !== "NULL" ? (
                    <img
                      src={`${IMG}/${row.it_image}`}
                      width="50"
                      height="50"
                    />
                  ) : (
                    <img
                      src="/icon/broken_image.svg"
                      width="50"
                      height="50"
                    />
                  )}
                </Col>
                <Col md={8}>
                  {row.it_name}
                  <br />
                  <small>{row.loc_name}</small>
                  <br />
                  <small>{row.it_serial_number}</small>
                </Col>
                <Col md={2} className="mt-2 text-right">
                {row.ic_count}
                </Col>
              </Row>
            </li>
          </ul>
        </Col>
      ))}
    </Row>
  );
}
