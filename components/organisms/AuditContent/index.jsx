import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setSelectItemLocation } from "redux/action/item";
import {
  BarcodeScanner,
  FormOptionItemLocation,
  StockFormItem,
  StockOutForm
} from "../../molecules";

export default function AuditContent({ branch, item, brlocIdx }) {
  const [inStock, setInStock] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
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
              {branch === 'Lokasi' ? (
                <FormOptionItemLocation placeholderText="Pilih Lokasi" />
              ) : (
                ""
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 mt-4">
              <label htmlFor="validationDefault04">
                <h5>Stok Tersimpan</h5>
              </label>
              <StockOutForm item={item} brMode={branch} />
            </Col>
            <StockFormItem
              instock={inStock}
              title="Stok Saat Ini"
              countDesc="Stok Terkoreksi"
              brlocIdx={brlocIdx}
              brMode={branch}
            />
          </Row>
        </div>
      </div>
    </div>
  );
}
