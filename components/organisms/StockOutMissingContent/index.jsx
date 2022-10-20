import Cookies from "js-cookie";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { setDetailItem, setFromDateStockMissing } from "redux/action/item";
import { getListItem } from "../../../services/item";
import {
  BarcodeScanner,
  FormOptionItemLocation,
  StockForm,
  StockMissingFormItem,
  StockOutForm,
} from "../../molecules";

export default function StockOutMissingtContent() {
  const { selectItemLocation, showItems } = useSelector(
    (state) => state.itemReducer
  );
  const [date, setDate] = useState(moment().format("MM/DD/YYYY"));
  const [brMode, setBrMode] = useState("");
  const items = selectItemLocation;

  const [inStock, setInStock] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();

  const getItemApi = useCallback(async (token, branch) => {
    const response = await getListItem(token, branch);
    setItems(response.data.data.item);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    const brmode = JSON.parse(localStorage.getItem("branch"));
    setInStock("out");
    if (showItems !== false) {
      getItemApi(token, branch);
    } else {
      dispatch(setDetailItem([]));
    }

    setBrMode(brmode.br_mode);
    dispatch(setFromDateStockMissing(date));
  }, []);

  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="card-body">
          <Row className="border-bottom">
            <Col md={8}><h4 className="text-danger">Tambah Stok Keluar Yang Hilang</h4></Col>
            <Col md={4}>
              <DateRangePicker
                initialSettings={{
                  singleDatePicker: true,
                  showDropdowns: true,
                  date,
                }}
                value={date}
                onApply={(event) =>
                  dispatch(setFromDateStockMissing(event.target.value))
                }
              >
                <input
                  type="text"
                  className="form-control text-center"
                />
              </DateRangePicker>
            </Col>
            <Col md={6} className="p-2 mb-2">
              <FormOptionItemLocation placeholderText="Pilih Lokasi" />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 mt-4">
              <label htmlFor="validationDefault04">
                <h5>Stok Tersimpan</h5>
              </label>
              <StockOutForm item={items} brMode={brMode} />
            </Col>
            <StockMissingFormItem
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
