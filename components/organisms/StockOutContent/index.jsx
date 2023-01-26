import Cookies from "js-cookie";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { setListAccount, setShowFormAccount } from "redux/action/account";
import { setShowItems } from "redux/action/item";
import { getListAccountCustomerOnly } from "services/account";
import { getItemByLocation } from "services/item";
import { getLocationItem } from "services/locationitem";
import {
  StockOutForm,
  StockOutFormItem
} from "../../molecules";
import ModalFormAccount from "../ModalFormAccount";

export default function StockOutContent() {
  const { listAccount } = useSelector((state) => state.accountReducer);
  const [items, setItems] = useState([]);

  const [date, setDate] = useState("");
  const [inStock, setInStock] = useState("");
  const [brMode, setBrMode] = useState("");
  const [selectAccount, setSelectAccount] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectLocation, setSelectLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabledDate, setIsDisabledDate] = useState(true);

  const router = useRouter();

  const dispatch = useDispatch();

  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  const handleShow = () => {
    dispatch(setShowFormAccount(true));
  };

  const getCallAPI = useCallback(async (locIdx, data, token, branch) => {
    setIsLoading(true);
    const resultAccount = await getListAccountCustomerOnly(token, branch);
    const resultLocations = await getLocationItem(token, branch);
    const resultItems = await getItemByLocation(locIdx, data, token, branch);
    setIsLoading(false);
    setItems(resultItems?.data.data.item);
    setLocations(resultLocations?.data.data.location);
    dispatch(setListAccount(resultAccount?.data.data.accounts));
  });

  useEffect(() => {
    const locIdx = 'all';
    const data = new FormData();
    data.append('token', token);

    setBrMode(branch);
    setInStock("out");
    dispatch(setShowItems(false));
    getCallAPI(locIdx, data, token, branch);

  }, []);

  const optionsAccount = [{}];
  if (listAccount.length !== 0) {
    optionsAccount = listAccount.map((d) => ({
      value: d.ac_idx,
      label: d.ac_name,
    }));

  }

  const MenuList = (props) => {
    const {
      MenuListHeader = null,
      MenuListFooter = null
    } = props.selectProps.components;

    return (
      <components.MenuList {...props}>
        {props.children.length && MenuListHeader}
        {props.children}
        {props.children.length && MenuListFooter}
      </components.MenuList>
    )
  }

  const MenuListFooter = ({ onClick }) => {
    return (
      <center onClick={onClick} className="border-top text-primary" style={{ cursor: "pointer" }}>
        <i className="fa fa-plus"></i> Tambah Akun
      </center>
    )
  }

  const handleChangeAccount = (e) => {
    setSelectAccount(e);
  }

  const optionsLocation = [{}];
  if (locations.length !== 0) {
    optionsLocation = locations.map((d) => ({
      value: d.loc_idx,
      label: d.loc_name,
    }));

  }

  const handleChangeLocation = async (e) => {
    setSelectLocation(e)
    const locIdx = "all";
    if (e !== null) {
      locIdx = e.value;
    }
    const data = new FormData();
    data.append('token', token);
    setIsLoading(true);
    const results = await getItemByLocation(locIdx, data, token, branch);
    setIsLoading(false);
    setItems(results?.data.data.item);
  }

  const handleIsDisableDate = (value) => {
    if (value === true) {
      setIsDisabledDate(false);
      setDate(moment().format("MM/DD/YYYY"));
    } else {
      setIsDisabledDate(true);
      setDate(null);
    }
  }


  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="card-body">
          <Row className="border-bottom">
            <Col md={8}><h4 className="text-danger">Stok Keluar</h4></Col>
            <Col md={12}>
            </Col>
            <Col md={12}>
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
                    <MenuListFooter onClick={handleShow} />
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
              Tanggal
            </Col>
            <Col md={3}>

              {
                isDisabledDate ? (
                  <input
                    type="text"
                    className="form-control mb-2"
                    disabled
                  />

                ) : (
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
                      className="form-control mb-2"
                    />
                  </DateRangePicker>
                )
              }

            </Col>
            <Col md={1} className="p-2">
              {
                isDisabledDate ? (
                  <i className="fa fa-pencil" style={{ cursor: "pointer" }} onClick={() => handleIsDisableDate(true)}></i>

                ) : (
                  <i className="fa fa-close text-danger" style={{ cursor: "pointer" }} onClick={() => handleIsDisableDate(false)}></i>

                )
              }
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 mt-4">
              <Select
                options={optionsLocation}
                placeholder={"Pilih Lokasi"}
                isClearable={true}
                onChange={handleChangeLocation}
                instanceId
                className="mb-3"
              />
              {isLoading ? (
                <Col className="d-flex justify-content-center">
                  <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                </Col>
              ) : (
                items.length === 0 ? (
                  ''
                ) : (
                  <StockOutForm item={items} brMode={brMode} />
                )
              )}
            </Col>
            <StockOutFormItem
              instock={inStock}
              title="Stok Keluar"
              countDesc="Stok Keluar"
              account={selectAccount ?? ""}
              brlocIdx=""
              location={selectLocation}
              date={date}
            />
          </Row>

          <ModalFormAccount type="Customer" />
        </div>
      </div>
    </div>
  );
}
