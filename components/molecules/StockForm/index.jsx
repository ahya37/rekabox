import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setDetailItem } from "redux/action/item";
import { generate } from "utils/randomstring";

export default function StockForm(props) {
  const IMG = process.env.NEXT_PUBLIC_IMG;
  const { item } = props;
  const [qword, setQword] = useState("");

  let items = []
  items = item.map((d) => ({
    id: generate(10),
    lc_idx: d.lc_idx,
    it_serial_number: d.it_serial_number,
    it_idx: d.it_idx,
    it_name: d.it_name,
    it_image: d.it_image,
    ic_count: d.ic_count,
    loc_name: d.loc_name
  }));

  const [filterData, setFilterData] = useState(items);
  const handleFilter = (event) => {
    const searchWord = event.target.value;

    setQword(searchWord);
    const newFilter = items.filter((value) => {
      return value.it_name.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilterData(items);
    } else {
      setFilterData(newFilter);
    }
  };


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
              <h6 className="text-center">Pilih lokasi terlebih dulu</h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Row>
      <Col md={12}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Cari nama item "
          value={qword}
          onChange={handleFilter}
        />

      </Col>
      {
        filterData.length != 0 && filterData.slice(0, 5).map((value, key) => {
          return (
            <Col style={{ cursor: "pointer" }} md={12} onClick={(e) => onSelected(value, e)} key={value.id}>
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
                        {value.loc_name ? (
                          <>
                            <br />
                            <small>{value.loc_name}</small>
                          </>

                        ) : (
                          ''
                        )}
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
