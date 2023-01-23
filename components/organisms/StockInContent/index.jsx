import Cookies from "js-cookie";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { setListAccount, setShowFormAccount } from "redux/action/account";
import { setListLocation, setShowFormLocation } from "redux/action/location";
import { getListAccountOwnerOnly } from "services/account";
import { getListLocationItem } from "services/locationitem";
import { getListItem } from "../../../services/item";
import styles from "../../../styles/Fileupload.module.css";
import {
  StockForm,
  StockFormItem
} from "../../molecules";
import ModalFormAccount from "../ModalFormAccount";
import ModalFormLocation from "../ModalFormLocation";


export default function StockInContent(props) {
  const [date, setDate] = useState(moment().format("MM/DD/YYYY"));
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectAccount, setSelectAccount] = useState("");
  const [selectLocation, setSelectLocation] = useState("");

  const { showItems } = useSelector(
    (state) => state.itemReducer
  );
  const { listAccount } = useSelector((state) => state.accountReducer);
  const { listLocation } = useSelector((state) => state.locationReducer);


  const [inStock, setInStock] = useState("");

  const handleShowModalFormAccount = () => {
    dispatch(setShowFormAccount(true));
  };

  const handleShowModalFormLocation = () => {
    dispatch(setShowFormLocation(true));
  };

  const dispatch = useDispatch();

  const getItemApi = useCallback(async (token, branch) => {
    setIsLoading(true);
    const response = await getListItem(token, branch);
    setIsLoading(false);
    setItems(response?.data.data.item);
  }, []);

  const getCallAPI = useCallback(async (token, branch) => {
    const response = await getListAccountOwnerOnly(token, branch);
    const resultLocations = await getListLocationItem(token, branch);
    dispatch(setListLocation(resultLocations?.data.data.location));
    dispatch(setListAccount(response?.data.data.accounts));
  });


  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  useEffect(() => {
    setInStock("in");
    getItemApi(token, branch);
    getCallAPI(token, branch);
  }, [setItems, showItems]);

  const optionsAccount = [{}];
  if (listAccount.length !== 0) {
    optionsAccount = listAccount.map((d) => ({
      value: d.ac_idx,
      label: d.ac_name,
    }));

  }

  const MenuList = (props) => {
    const {
      MenuListFooter = null
    } = props.selectProps.components;

    return (
      <components.MenuList {...props}>
        {props.children}
        {props.children.length && MenuListFooter}
      </components.MenuList>
    )
  }

  const MenuListFooter = ({ onClick, type }) => {
    return (
      <center onClick={onClick} className="border-top text-primary" style={{ cursor: "pointer" }}>
        <i className="fa fa-plus"></i> {type === 'account' ? 'Tambah Akun' : 'Tambah Lokasi'}
      </center>
    )
  }

  const handleChangeAccount = (e) => {
    setSelectAccount(e)
  }

  const optionsLocation = [{}];
  if (listLocation.length !== 0) {
    optionsLocation = listLocation.map((d) => ({
      value: d.loc_idx,
      label: d.loc_name,
    }));

  }

  const handleChangeLocation = (e) => {
    setSelectLocation(e)
  }

  return (
    <div className="container-fluid ">
      <div className="iq-card">
        <div className="card-body">
          <Row className="border-bottom">
            <Col md={8}><h4 className="text-primary">Stok Masuk</h4></Col>
            <Col md={4}>
            </Col>
            <Col md={1}>
              <label>Lokasi   <sup className={styles["text-required"]}>*</sup></label>
            </Col>
            <Col md={3} className="mb-1">
              <Select
                components={{
                  MenuList,
                  MenuListFooter: (
                    <MenuListFooter onClick={handleShowModalFormLocation} type="location" />
                  )
                }}
                placeholder={'Pilih Lokasi'}
                options={optionsLocation}
                onChange={handleChangeLocation}
                isClearable={true}
                instanceId
              />

            </Col>
            <Col md={2}></Col>
            <Col md={6}>
              <Button variant="default" className="border float-right">
                Upload Excel
              </Button>
            </Col>
            <Col md={1}>
              <label>Akun</label>
            </Col>
            <Col md={3} className="mb-2">
              <Select
                components={{
                  MenuList,
                  MenuListFooter: (
                    <MenuListFooter onClick={handleShowModalFormAccount} type="account" />
                  )
                }}
                options={optionsAccount}
                placeholder={"Akun"}
                isClearable={true}
                onChange={handleChangeAccount}
                instanceId
              />
            </Col>
            <Col md={12}></Col>
            <Col md={1}>
              <label>Tanggal Datang</label>
            </Col>
            <Col md={3} className="mb-2">
              <DateRangePicker
                initialSettings={{
                  singleDatePicker: true,
                  showDropdowns: true,
                  date,
                }}
                value={date}
                onApply={(event) => setDate(event.target.value)}
              >
                <input
                  type="text"
                  className="form-control"
                />
              </DateRangePicker>
            </Col>

          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 mt-2">
              {isLoading ? (
                <Col className="d-flex justify-content-center">
                  <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                </Col>
              ) : (
                items.length === 0 ? (
                  ''
                ) : (
                  <StockForm item={items} />
                )
              )}

            </Col>
            <StockFormItem
              instock={inStock}
              title="Stok Masuk"
              countDesc="Stok Masuk"
              account={selectAccount}
              brlocIdx=""
              brMode=""
              location={selectLocation}
              date={date}
            />
          </Row>
        </div>
      </div>

      <ModalFormAccount type="Suplier" />
      <ModalFormLocation type="Suplier" />
    </div>
  );
}
