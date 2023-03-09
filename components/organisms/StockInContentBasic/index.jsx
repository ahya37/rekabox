import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { setListAccount, setShowFormAccount } from "redux/action/account";
import { getListAccountOwnerOnly } from "services/account";
import { getListLocationItem } from "services/locationitem";
import { getListItem } from "../../../services/item";
import {
  StockForm,
  StockFormItem
} from "../../molecules";
import ModalFormAccount from "../ModalFormAccount";

export default function StockInContent() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inStock, setInStock] = useState("");
  const [selectAccount, setSelectAccount] = useState("");
  const [brlocIdx, setBrlocIdx] = useState("");

  const { listAccount } = useSelector((state) => state.accountReducer);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleShow = () => {
    dispatch(setShowFormAccount(true));
  };

  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  const getItemApi = useCallback(async (token, branch) => {
    setIsLoading(true);
    const response = await getListItem(token, branch);
    setIsLoading(false);
    setItems(response?.data.data.item);
  }, []);

  const getListAccountAPI = useCallback(async (token, branch) => {
    const response = await getListAccountOwnerOnly(token, branch);
    dispatch(setListAccount(response?.data.data.accounts));
  });

  const getLocationAPI = useCallback(async (token, branch) => {
    const response = await getListLocationItem(token, branch);
    setBrlocIdx(response?.data.data.location[0].loc_idx)
  });


  useEffect(() => {
    setInStock("in");
    getItemApi(token, branch);
    getListAccountAPI(token, branch);
    getLocationAPI(token, branch);
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
        <i className="fa fa-plus"></i> Tambah Suplier
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
                placeholder={"Suplier"}
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
              {isLoading? (
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
              brlocIdx={brlocIdx}
              brMode="Basic"

            />
          </Row>

          <ModalFormAccount type="Suplier" />
        </div>
      </div>
    </div>
  );
}
