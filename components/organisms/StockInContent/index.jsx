import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row,Spinner } from "react-bootstrap";
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

  const getItemApi = useCallback(async (locIdx, data,token,branch) => {
    setIsLoading(true);
    const response = await getItemByLocation(locIdx, data, token,branch);
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
      getItemApi(locIdx, data,token,branch);
    } else {
      dispatch(setDetailItem([]));
      setItems([]);
    }
  }, [setItems, showItems]);
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
                      <h4 className="card-title text-primary">Stok Masuk</h4>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-3">
                    <Button
                      variant="default border"
                      className="float-right"
                      onClick={() => router.push("/team/stockin/sm")}
                    >
                      <i className="fa fa-plus"></i>
                      Tambah Transaksi Yang Hilang
                    </Button>
                  </div>
                </div>
                <div className="iq-card-body border-bottom">
                  <Row>
                    <Col xs={3} md={3}>
                      <FormOptionLocation />
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
                  {isLoading ? (
                    <Col className="d-flex justify-content-center">
                      <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true"/>
                    </Col>
                  ) : (
                    items.length === 0 ? (
                      <p className="d-flex justify-content-center">Tidak ada data</p>
                    ) : (
                      <StockForm item={items} />
                    )
                  )}
                </div>
              </div>
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
