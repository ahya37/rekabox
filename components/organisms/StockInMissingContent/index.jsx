import Cookies from "js-cookie";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { getListItem } from "../../../services/item";
import {
  BarcodeScanner,
  FormOptionLocation,
  StockForm,
  StockMissingFormItem,
} from "../../molecules";

export default function StockInMissingContent() {
  const [date, setDate] = useState(moment().format("MM/DD/YYYY"));
  const [items, setItems] = useState([]);

  const { selectItemLocation, showItems } = useSelector(
    (state) => state.itemReducer
  );

  const [inStock, setInStock] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();

  const getItemApi = useCallback(async (token,branch) => {
    const response = await getListItem(token,branch);
    setItems(response.data.data.item);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    setInStock("in");
    if (showItems !== false) {
      getItemApi(token,branch);
    } else {
      dispatch({ type: "SET_DETAIL_ITEM", value: [] });
      setItems([]);
    }
    dispatch({
      type: "SET_USEFORM_DATE_STOCK_MISSING",
      value: date,
    });
  }, [setItems, showItems]);

  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="iq-card-body">
          <Row>
            <div className="col-md-12 col-sm-12">
              <div className="iq-card">
                <div className="iq-card-header border-bottom">
                  <Row className="mb-2">
                    <Col md={8}>
                      <div className="iq-header-title">
                        <h4 className="card-title text-primary">
                          Tambah Stok Masuk Yang Hilang
                        </h4>
                      </div>
                    </Col>
                    <Col md={4}>
                      <DateRangePicker
                        initialSettings={{
                          singleDatePicker: true,
                          showDropdowns: true,
                          date,
                        }}
                        value={date}
                        onApply={(event) =>
                          dispatch({
                            type: "SET_USEFORM_DATE_STOCK_MISSING",
                            value: event.target.value,
                          })
                        }
                      >
                        <input
                          type="text"
                          className="form-control text-center"
                        />
                      </DateRangePicker>
                    </Col>
                  </Row>
                </div>
                <div className="iq-card-body border-bottom">
                  <Row>
                    <Col xs={3} md={3}>
                      <FormOptionLocation />
                    </Col>
                    <Col xs={3} md={3}></Col>
                    <Col xs={3} md={3}></Col>
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
                  <StockForm item={items} />
                </div>
              </div>
            </Col>
            <StockMissingFormItem
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
