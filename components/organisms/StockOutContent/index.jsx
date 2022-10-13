import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  BarcodeScanner,
  FormOptionItemLocation,
  StockFormItem,
  StockOutForm,
} from "../../molecules";

export default function StockOutContent() {
  const { selectItemLocation } = useSelector((state) => state.itemReducer);
  const [inStock, setInStock] = useState("");
  const router = useRouter();
  const items = selectItemLocation;

  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    setInStock("out");
    dispatch({ type: "SET_SHOW_ITEMS", value: false });
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
                      <h4 className="card-title text-danger">Stok Keluar</h4>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-3">
                    <Button
                      variant="default border"
                      className="float-right"
                      onClick={() => router.push("/team/stockout/sm")}
                    >
                      <i className="fa fa-plus"></i>
                      Tambah Transaksi Yang Hilang
                    </Button>
                  </div>
                </div>
                <div className="iq-card-body border-bottom">
                  <Row>
                    <Col xs={3} md={3}>
                      <FormOptionItemLocation placeholderText="Pilih Lokasi" />
                    </Col>
                    <Col xs={3} md={3}></Col>
                    <Col xs={3} md={3}>
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
                          <h5>Stok Tersimpan</h5>
                        </label>
                      </Col>
                    </Row>
                  </Col>
                  <StockOutForm item={items} />
                </div>
              </div>
            </Col>
            <StockFormItem
              instock={inStock}
              title="Stok Keluar"
              countDesc="Stok Keluar"
            />
          </Row>
        </div>
      </div>
    </div>
  );
}
