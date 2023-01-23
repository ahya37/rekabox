import Cookies from "js-cookie";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { setListAccount, setShowFormAccount } from "redux/action/account";
import { setFromDateStockMissing } from "redux/action/item";
import { getListAccountCustomerOnly } from "services/account";
import { getListLocationItem } from "services/locationitem";
import { getListItem } from "../../../services/item";
import {
  StockMissingFormItem,
  StockOutForm
} from "../../molecules";
import ModalFormAccount from "../ModalFormAccount";


export default function StockOutMissingtContent() {
  
  const { listAccount } = useSelector((state) => state.accountReducer);

  const [date, setDate] = useState(moment().format("MM/DD/YYYY"));
  const [brMode, setBrMode] = useState("");
  const [items, setItems] = useState([]);
  const [brlocIdx, setBrlocIdx] = useState("");
  const [inStock, setInStock] = useState("");
  const [selectAccount, setSelectAccount] = useState("");
  const [qword, setQword] = useState("");
  const [filterData, setFilterData] = useState([]);

  const handleShow = () => {
    dispatch(setShowFormAccount(true));
  };

  const dispatch = useDispatch();

  const getItemApi = useCallback(async (token, branch) => {
    const response = await getListItem(token, branch);
    setItems(response?.data.data.item);
    setFilterData(response?.data.data.item);
  }, []);

  const getLocationAPI = useCallback(async (token, branch) => {
    const response = await getListLocationItem(token, branch);
    setBrlocIdx(response?.data.data.location[0].loc_idx)
  });

  const getListAccountAPI = useCallback(async (token, branch) => {
    const response = await getListAccountCustomerOnly(token, branch);
    dispatch(setListAccount(response?.data.data.accounts));
  });

  const handleFilter = (event) => {
    const searchWord = event.target.value;

    setQword(searchWord);
    const newFilter = items.filter((value) => {
      return value.it_name.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilterData(items);
    } else {
      setFilterData(newFilter);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    const brmode = JSON.parse(localStorage.getItem("branch"));
    setInStock("out");
    getItemApi(token, branch);
    setBrMode(brmode.br_mode);
    dispatch(setFromDateStockMissing(date));
    getLocationAPI(token, branch);
    getListAccountAPI(token, branch)
  }, []);

  const optionsAccount = [{}];
  if (listAccount.length !== 0 ) {
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

  const MenuListFooter = ({ onClick }) => {
    return (
      <center onClick={onClick} className="border-top text-primary" style={{ cursor: "pointer" }}>
        <i className="fa fa-plus"></i> Tambah Akun
      </center>
    )
  }

  const handleChangeAccount = (e) => {
    setSelectAccount(e)
  }

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
          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 mt-4">
            <input
                type="text"
                className="form-control mb-2"
                placeholder="Cari nama item "
                value={qword}
                onChange={handleFilter}

              />
            {items.length === 0 ? (
                ''
              ) : (
              <StockOutForm item={filterData} brMode={brMode} />
              )}
            </Col>
            <StockMissingFormItem
              instock={inStock}
              title="Stok Keluar"
              countDesc="Stok Keluar"
              brlocIdx={brlocIdx}
              brMode="Basic"
              account={selectAccount ?? ""}
            />
          </Row>
        </div>
      </div>
      <ModalFormAccount type="Customer" />
    </div>
  );
}
