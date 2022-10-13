import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  BarcodeScanner,
  FormOptionItemLocation,
  StockFormItem,
  StockOutForm
} from "../../molecules";

export default function AuditContent({branch, item,brlocIdx}) {
  const [inStock, setInStock] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setInStock("audit");
    dispatch({ type: "SET_ITEM_BY_LOCATION", value: [] });

  }, []);

  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="iq-card-body">
          <Row>
            <div className="col-md-12 col-sm-12">
              <div className="iq-card">
                <div className="iq-card-body d-flex justify-content-between border-bottom">
                  <div className="col-md-9 col-sm-9">
                    <div className="iq-header-title">
                      <h4 className="card-title text-success">Audit</h4>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-3"></div>
                </div>
                <div className="iq-card-body border-bottom">
                  <Row>
                    <Col xs={3} md={3}>
                      {branch === 'Lokasi' ? (
                        <FormOptionItemLocation placeholderText="Pilih Lokasi" />
                      ) : (
                        ""
                      ) }
                    </Col>
                    <Col xs={3} md={3}></Col>
                    <Col xs={3} md={3}>
                      <Button variant="default" className="border float-right">
                        Audit Via Excel
                      </Button>
                    </Col>
                    <Col xs={3} md={3}>
                      <BarcodeScanner />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <Col xs={12} md={6}>
              <div className="iq-card">
                <div className="iq-card-body">
                  <Col md={12} xs={12} className="mb-3">
                    <Row>
                      <Col md={9} xs={9} sm={9}>
                        <label htmlFor="validationDefault04">
                          <h5>Stok Tersimpan</h5>
                        </label>
                      </Col>
                    </Row>
                  </Col>
                  <StockOutForm item={item} brMode={branch} />
                </div>
              </div>
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
