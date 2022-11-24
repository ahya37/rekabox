import { Formik } from "formik";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { setListAccount, setShowFormAccount } from "redux/action/account";
import { setDetailItem } from "redux/action/item";
import { getListAccountOwnerOnly, setSaveAccount } from "services/account";
import { getItemByLocation } from "../../../services/item";
import {
  FormOptionLocation,
  StockForm,
  StockFormItem
} from "../../molecules";
import ModalFormAccount from "../ModalFormAccount";

export default function StockInContent(props) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectAccount, setSelectAccount] = useState("");

  const { showItems } = useSelector(
    (state) => state.itemReducer
  );
  const { listAccount } = useSelector((state) => state.accountReducer);

  const [inStock, setInStock] = useState("");
  const router = useRouter();

  const handleShow = () => {
    dispatch(setShowFormAccount(true));
  };


  const dispatch = useDispatch();

  const getItemApi = useCallback(async (locIdx, data, token, branch) => {
    setIsLoading(true);
    const response = await getItemByLocation(locIdx, data, token, branch);
    setIsLoading(false);
    setItems(response.data.data.item);
  }, []);

  const getListAccountAPI = useCallback(async (token, branch) => {
    const response = await getListAccountOwnerOnly(token, branch);
    dispatch(setListAccount(response?.data.data.accounts));
  });

  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  useEffect(() => {
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

    getListAccountAPI(token, branch);
  }, [setItems, showItems]);

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

            </Col>
            <Col md={3} className="p-2">
              <FormOptionLocation placeholderText="Pilih lokasi" />
            </Col>
            <Col md={3}></Col>
            <Col md={6}>
              <Button variant="default" className="border float-right">
                Upload Excel
              </Button>
            </Col>
            <Col md={3} className="p-2">
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
              account={selectAccount}
              brlocIdx=""
              brMode=""
            />
          </Row>
        </div>
      </div>

      <ModalFormAccount type="Suplier" />
    </div>
  );
}
