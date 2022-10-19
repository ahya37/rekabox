import Cookies from "js-cookie";
import Image from "next/image";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setDetailItem, setLocationByItem } from "redux/action/item";
import { getLocationByItem } from "../../../services/item";

export default function ShowItem() {
  const { selectItemLocation } = useSelector((state) => state.itemReducer);
  const [qword, setQword] = useState("");
  const IMG = process.env.NEXT_PUBLIC_IMG;
  const [filterData, setFilterData] = useState(selectItemLocation);
  const dispatch = useDispatch();

  const onSelectDetail = async (list) => {
    dispatch(setDetailItem(list));
    const it_idx = list.it_idx;
    const token = Cookies.get("token");
    const useForm = {
      token,
    };

    const data = new FormData();
    data.append("token", useForm.token);
    const location = await getLocationByItem(it_idx, data, token);
    dispatch(setLocationByItem(location?.data.data.lokasi));
  };

  const handleFilter = (event) => {
    const searchWord = event.target.value;

    setQword(searchWord);
    const newFilter = selectItemLocation.filter((value) => {
      return value.it_name.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilterData(selectItemLocation);
    } else {
      setFilterData(newFilter);
    }
  };

  function ListItems({ data }) {
    return data.map((list) => (
      <Col md={12} onClick={() => onSelectDetail(list)} key={list.lc_idx} style={{ cursor: "pointer" }}>
        <div className="border-bottom">
          <div className="mt-2 ml-2">
            <Row className="mr-1">
              <Col md={2}>
                {list.it_image !== "NULL" ? (
                  <img
                    src={`${IMG}/${list.it_image}`}
                    width="50"
                    height="50"
                    className="rounded-top rounded-bottom"
                  />
                ) : (
                  <Image
                    src="/icon/broken_image.svg"
                    width={50}
                    height={50}
                    className="rounded-top rounded-bottom"
                  />
                )}
              </Col>
              <Col md={8}>
                <h6>
                  {list.it_name}
                  <br />
                  <small>{list.it_serial_number} / {list.loc_name}</small>
                  
                </h6>
              </Col>
              <Col md={2} className="py-4 text-right font-weight-bold text-primary">
                {list.ic_count}
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    ))
  }

  return (
    <div className="col-md-6 border-top">
      <Row className="mt-3">
        <div className="col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Cari nama item "
            value={qword}
            onChange={handleFilter}
          />
        </div>
      </Row>

      <div className="row mt-3">
        {filterData.length === 0 ? <ListItems data={selectItemLocation} /> : <ListItems data={filterData} />}
      </div>
    </div>
  );
}
