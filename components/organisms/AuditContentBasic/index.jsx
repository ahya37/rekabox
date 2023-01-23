import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setSelectItemLocation } from "redux/action/item";
import { getListLocationItem } from "services/locationitem";
import {
  StockFormItem,
  StockOutForm
} from "../../molecules";

export default function AuditContentBasic({item}) {
  const IMG = process.env.NEXT_PUBLIC_IMG;

  const [inStock, setInStock] = useState("");
  const [qword, setQword] = useState("");
  const [brlocIdx, setBrlocIdx] = useState("");

  const [query, setQuery] = useState("");

  const searchFilter = (array) => {
    return array.filter(
      (el) => el.it_name.toLowerCase().includes(query)
    )
  }

  const filtered = searchFilter(item);
  const handleChange = (e) => {
    setQuery(e.target.value);
  }

  const { loading } = useSelector((state) => state.itemReducer);

  const dispatch = useDispatch();

  const getLocationAPI = useCallback(async (token, branch) => {
    const response = await getListLocationItem(token, branch);
    setBrlocIdx(response?.data.data.location[0].loc_idx)
  });

  useEffect(() => {
    const token  = Cookies.get("token");
    const branch = Cookies.get("branch");
    setInStock("audit");
    dispatch(setSelectItemLocation([]));
    getLocationAPI(token, branch);
  }, []);  
  
  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="card-body">
          <Row className="border-bottom">
            <Col md={8}><h4 className="text-primary">Audit</h4></Col>
            <Col md={4}></Col>
          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 mt-4">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Cari nama item "
                onChange={handleChange}

              />
              {loading ? (
                <Col className="d-flex justify-content-center">
                  <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                </Col>
              ) : (
                <StockOutForm item={filtered} brMode={"Basic"} />
                
              )}
            </Col>
            <StockFormItem
              instock={inStock}
              title="Stok Saat Ini"
              countDesc="Stok Terkoreksi"
              account={""}
              brlocIdx={brlocIdx}
              brMode="Basic"
            />
          </Row>
        </div>
      </div>
    </div>
  );
}
