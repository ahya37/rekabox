import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setSelectItemLocation } from "redux/action/item";
import {
  FormOptionItemLocation,
  StockFormItem,
  StockOutForm
} from "../../molecules";

export default function AuditContent({item}) {
  const {fromLocIdx} = useSelector((state) => state.itemReducer);
  const [inStock, setInStock] = useState("");
  const [brMode, setBrMode] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const branch = Cookies.get("branch");
    setBrMode(branch.br_mode);
    setInStock("audit");
    dispatch(setSelectItemLocation([]))
  }, []);

  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="card-body">
          <Row className="border-bottom">
            <Col md={8}><h4 className="text-primary">Audit</h4></Col>
            <Col md={4}></Col>
            <Col md={6} className="p-2 mb-2">
              <FormOptionItemLocation placeholderText="Pilih Lokasi" />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 mt-4">
              <label htmlFor="validationDefault04">
                <h5>Stok Tersimpan</h5>
              </label>
              <StockOutForm item={item} brMode={brMode} />
            </Col>
            <StockFormItem
              instock={inStock}
              title="Stok Saat Ini"
              countDesc="Stok Terkoreksi"
              account={""}
              brlocIdx={fromLocIdx.locIdx}
              brMode={brMode}
            />
          </Row>
        </div>
      </div>
    </div>
  );
}
