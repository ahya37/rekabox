import Cookies from "js-cookie";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setDetailItem, setLocationByItem } from "redux/action/item";
import { getListItem, getLocationByItem } from "../../../services/item";

export default function ShowItem() {
  const [qword, setQword] = useState("");
  const IMG = process.env.NEXT_PUBLIC_IMG;
  const [filterData, setFilterData] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const token = Cookies.get("token");
  const branch = Cookies.get('branch');

  const getItemApi = useCallback(async (token, branch) => {
    setIsLoading(true);
    const results = await getListItem(token, branch);
    setIsLoading(false);
    setItems(results?.data.data.item);
    setFilterData(results?.data.data.item);
  });

  useEffect(() => {
    getItemApi(token, branch);
  }, [])


  const onSelectDetail = async (list) => {
    dispatch(setDetailItem(list));
    const it_idx = list.it_idx;
    const useForm = {
      token,
    };

    const data = new FormData();
    data.append("token", useForm.token);
    const location = await getLocationByItem(it_idx, data, token);
    // PERBAIKI API DISINI
    dispatch(setLocationByItem(location?.data.data.lokasi));
  };

  const handleFilter = (event) => {
    const searchWord = event.target.value;

    setQword(searchWord);
    const newFilter = filterData.filter((value) => {
      return value.it_name.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilterData(items);
    } else {
      setFilterData(newFilter);
    }
  };

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
        {isLoading ? (
          <div className="col-md-12 mt-4 d-flex justify-content-center">
            <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              className="text-center"
              aria-hidden="true"
            />
          </div>
        ) :
          filterData.length != 0 &&
          filterData.slice(0, 5).map((value, key) => {
            return (
              <Col md={12} onClick={() => onSelectDetail(value)} key={value.it_idx
              } style={{ cursor: "pointer" }}>
                <div className="border-bottom">
                  <div className="mt-2 ml-2">
                    <Row className="mr-1">
                      <Col md={2}>
                        {value.it_image !== "NULL" ? (
                          <img
                            src={`${IMG}/${value.it_image}`}
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
                          {value.it_name}
                          <br />
                          <small>{value.it_serial_number} / {value.loc_name}</small>

                        </h6>
                      </Col>
                      <Col md={2} className="py-4 text-right font-weight-bold text-primary">
                        {value.ic_count}
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            )
          })
        }

      </div>


    </div>
  );
}
