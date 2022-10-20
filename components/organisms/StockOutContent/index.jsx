import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setShowItems } from "redux/action/item";
import {
  BarcodeScanner,
  FormOptionItemLocation,
  StockFormItem,
  StockOutForm,
} from "../../molecules";

export default function StockOutContent() {
  const { selectItemLocation } = useSelector((state) => state.itemReducer);
  const [inStock, setInStock] = useState("");
  const [brMode, setBrMode] = useState("");
  const router = useRouter();
  const items = selectItemLocation;

  const dispatch = useDispatch();

  useEffect(() => {
    const branch = JSON.parse(localStorage.getItem("branch"));
    setBrMode(branch.br_mode);
    setInStock("out");
    dispatch(setShowItems(false));
  }, []);



  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="card-body">
          <Row className="border-bottom">
            <Col md={8}><h4 className="text-danger">Stok Keluar</h4></Col>
            <Col md={4}>
              <Button
                variant="default border"
                className="float-right"
                onClick={() => router.push("/team/stockout/sm")}
              >
                <i className="fa fa-plus"></i>
                Tambah Transaksi Yang Hilang
              </Button>
            </Col>
            <Col md={6} className="p-2 mb-2">
              <FormOptionItemLocation placeholderText="Pilih Lokasi" />
            </Col>
            <Col md={6}>
              <Button variant="default" className="border float-right">
                Upload Excel
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 mt-4">
              <label htmlFor="validationDefault04">
                <h5>Stok Tersimpan</h5>
              </label>
              <StockOutForm item={items} brMode={brMode} />
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
