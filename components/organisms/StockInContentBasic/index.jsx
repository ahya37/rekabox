import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { setListAccount, setShowFormAccount } from "redux/action/account";
import { getListAccountOwnerOnly } from "services/account";
import { getListLocationItem } from "services/locationitem";
import { getItemByLocation } from "../../../services/item";
import {
  StockForm,
  StockFormItem
} from "../../molecules";
import ModalFormAccount from "../ModalFormAccount";

export default function StockInContent() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [qword, setQword] = useState("");
  const [inStock, setInStock] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [selectAccount, setSelectAccount] = useState("");
  const [brlocIdx, setBrlocIdx] = useState("");

  const { listAccount } = useSelector((state) => state.accountReducer);

  const router   = useRouter();
  const dispatch = useDispatch();

  const handleShow = () => {
    dispatch(setShowFormAccount(true));
  };

  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

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

  const getItemApi = useCallback(async (locIdx, data, token, branch) => {
    setIsLoading(true);
    const response = await getItemByLocation(locIdx, data, token, branch);
    setIsLoading(false);
    setItems(response.data.data.item);
    setFilterData(response.data.data.item);
  }, []);

  const getListAccountAPI = useCallback(async (token, branch) => {
    const response = await getListAccountOwnerOnly(token, branch);
    dispatch(setListAccount(response?.data.data.accounts));
  });

  // GET LOKASI BRANCH MODE BASIC. HANYA SATU LOKASI
  const getLocationAPI = useCallback(async (token, branch) => {
    const response = await getListLocationItem(token, branch);
    setBrlocIdx(response?.data.data.location[0].loc_idx)
  })


  useEffect(() => {
    const locIdx = 'all';
    const data = new FormData();
    data.append("token", token);
    setInStock("in");
    getItemApi(locIdx, data, token, branch);
    getListAccountAPI(token, branch);
    getLocationAPI(token, branch);
  }, []);

  const optionsAccount = listAccount.map((d) => ({
    value: d.ac_idx,
    label: d.ac_name,
  }));

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
            <Col md={3} className="p-3 mb-2">
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
            <Col md={3}></Col>
            <Col md={6}>
              <Button variant="default" className="border float-right">
                Upload Excel
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 mt-2">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Cari nama item "
                value={qword}
                onChange={handleFilter}

              />
              {isLoading ? (
                <Col className="d-flex justify-content-center">
                  <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                </Col>
              ) : (
                items.length === 0 ? (
                  <p className="d-flex justify-content-center">Pilih lokasi terlebih dahulu</p>
                ) : (
                  <StockForm item={filterData} />
                )
              )}

            </Col>
            <StockFormItem
              instock={inStock}
              title="Stok Masuk"
              countDesc="Stok Masuk"
              account={selectAccount}
              brlocIdx={brlocIdx}
              brMode="Basic"

            />
          </Row>

         <ModalFormAccount type="Suplier"/>
        </div>
      </div>
    </div>
  );
}
