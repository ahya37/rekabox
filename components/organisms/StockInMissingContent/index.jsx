import Cookies from "js-cookie";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { setDetailItem, setFromDateStockMissing } from "redux/action/item";
import { getListItem } from "../../../services/item";
import {
  FormOptionLocation,
  StockForm,
  StockMissingFormItem
} from "../../molecules";
import styles from "../../../styles/Fileupload.module.css";

export default function StockInMissingContent() {
  const [date, setDate] = useState(moment().format("MM/DD/YYYY"));
  const [items, setItems] = useState([]);

  const { showItems } = useSelector(
    (state) => state.itemReducer
  );

  const [inStock, setInStock] = useState("");

  const dispatch = useDispatch();

  const getItemApi = useCallback(async (token, branch) => {
    const response = await getListItem(token, branch);
    setItems(response.data.data.item);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    setInStock("in");

    getItemApi(token, branch);
    dispatch(setDetailItem([]))
    setItems([]);

    dispatch(setFromDateStockMissing(date))
  }, [setItems, showItems]);


  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="card-body">
          <Row className="border-bottom">
            <Col md={8}><h4 className="text-primary"> Tambah Stok Opname</h4></Col>
            <Col md={4}>
              <DateRangePicker
                initialSettings={{
                  singleDatePicker: true,
                  showDropdowns: true,
                  date,
                }}
                value={date}
                onApply={(event) =>
                  dispatch(setDetailItem(event.target.value))
                }
              >
                <input
                  type="text"
                  className="form-control text-center"
                />
              </DateRangePicker>
            </Col>
            <Col md={1}>
              <label>Lokasi <sup className={styles["text-required"]}>*</sup></label>
            </Col>
            <Col md={5} className="mb-2">
              <FormOptionLocation placeholderText="Pilih lokasi" />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 mt-4">
              {items.length === 0 ? (
                ''
              ) : (
                <StockForm item={items} />

              )}
            </Col>
            <StockMissingFormItem
              instock={inStock}
              title="Stok Masuk"
              countDesc="Stok Masuk"
              brlocIdx=""
            />
          </Row>
        </div>
      </div>
    </div>
  );
}
