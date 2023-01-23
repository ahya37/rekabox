import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { connect, useSelector } from "react-redux";
import { setDetailItem } from "../../../redux/action/item";
import {
  BarcodeScanner,
  FormOptionItemLocation,
  PageTitle,
  StockFormMoveItem,
  StockOutForm,
  FormOptionLocation,
} from "../../molecules";

export default function StockMoveContent() {
  const { selectItemLocation } = useSelector((state) => state.itemReducer);

  const [inStock, setInStock] = useState("");
  const router = useRouter();
  const items = selectItemLocation;

  useEffect(() => {
    const token = Cookies.get("token");
    setInStock("move");
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
                      <h4 className="card-title text-primary">Stok Pindah</h4>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-3"></div>
                </div>
                <div className="iq-card-body border-bottom">
                  <Row>
                    <Col xs={3} md={3}>
                      <FormOptionItemLocation placeholderText="Pilih Lokasi Awal" />
                    </Col>
                    <Col xs={1} md={1}>
                      <i className="fa fa-arrow-right mt-3 ml-3"></i>
                    </Col>
                    <Col xs={3} md={3}>
                      <FormOptionLocation placeholderText="Pilih Lokasi Tujuan" />
                    </Col>
                    <Col xs={2} md={2}>
                      <Button variant="default" className="border float-right">
                        Upload Excel
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
                          <h5>Pilih Item</h5>
                        </label>
                      </Col>
                    </Row>
                  </Col>
                  <StockOutForm item={items} />
                </div>
              </div>
            </Col>
            <StockFormMoveItem />
          </Row>
        </div>
      </div>
    </div>
  );
}
