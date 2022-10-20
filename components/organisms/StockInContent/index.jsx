import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setDetailItem } from "redux/action/item";
import { getItemByLocation } from "../../../services/item";
import {
  BarcodeScanner,
  FormOptionLocation,
  StockForm,
  StockFormItem
} from "../../molecules";

export default function StockInContent(props) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { showItems } = useSelector(
    (state) => state.itemReducer
  );

  const [inStock, setInStock] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();

  const getItemApi = useCallback(async (locIdx, data, token, branch) => {
    setIsLoading(true);
    const response = await getItemByLocation(locIdx, data, token, branch);
    setIsLoading(false);
    setItems(response.data.data.item);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    const locIdx = showItems.value;
    const data = new FormData();
    data.append("token", token);

    setInStock("in");

    if (showItems !== false) {
      getItemApi(locIdx, data, token, branch);
    } else {
      dispatch(setDetailItem([]));
      setItems([]);
    }
  }, [setItems, showItems]);
  return (
    <div className="container-fluid ">
      <div className="iq-card">
        <div className="card-body">
          <Row className="border-bottom">
            <Col md={8}><h4 className="text-primary">Stok Masuk</h4></Col>
            <Col md={4}>
              <Button
                variant="default border"
                className="float-right"
                onClick={() => router.push("/team/stockin/sm")}
              >
                <i className="fa fa-plus"></i>
                Tambah Transaksi Yang Hilang
              </Button>
            </Col>
            <Col md={6} className="p-2 mb-2">
              <FormOptionLocation placeholderText="Pilih lokasi" />
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
              {isLoading ? (
                <Col className="d-flex justify-content-center">
                  <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                </Col>
              ) : (
                items.length === 0 ? (
                  <p className="d-flex justify-content-center">Pilih lokasi terlebih dahulu</p>
                ) : (
                  <StockForm item={items} />
                )
              )}

            </Col>
            <StockFormItem
              instock={inStock}
              title="Stok Masuk"
              countDesc="Stok Masuk"
            />
          </Row>
        </div>
      </div>
    </div>
  );
}
