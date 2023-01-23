import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setDetailItem } from "redux/action/item";

export default function StockOutForm(props) {
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
      {
        item.length != 0 && item.slice(0, 5).map((value, key) => {
          return (
            <Col style={{ cursor: "pointer" }} md={12} onClick={(e) => onSelected(value, e)} key={value.it_idx}>
              <ul className="col-md-12 list-group list-group-flush border-bottom">
                <li className="list-group-item p-1">
                  <Row>
                    <Col md={2}>
                      {value.it_image !== "NULL" ? (
                        <img
                          src={`${IMG}/${value.it_image}`}
                          width="50"
                          height="50"
                        />
                      ) : (
                        <img src="/icon/broken_image.svg" width="50" height="50" />
                      )}
                    </Col>
                    <Col md={8}>
                      <h6>
                        {value.it_name}
                        <br />
                        <small>{value.it_serial_number}</small>
                      </h6>
                    </Col>
                    <Col md={2} className="mt-2 text-right">
                      {value.ic_count}
                    </Col>
                  </Row>
                </li>
              </ul>
            </Col>
          )
        })
      }
      </Row>
  );
}
