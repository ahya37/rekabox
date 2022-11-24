import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { setShowItems } from "redux/action/item";
import { getListAccountOwnerCustomer } from "services/account";
import {
    StockFormItem,
    StockOutForm
} from "../../molecules";

export default function StockOutContentBasic() {
  const { selectItemLocation } = useSelector((state) => state.itemReducer);
  const items = selectItemLocation;
  
  const [inStock, setInStock] = useState("");
  const [brMode, setBrMode] = useState("");
  const [account, setAccount] = useState([]);
  const [show, setShow] = useState(false);

  const router = useRouter();


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  const getListAccountAPI = useCallback(async (token, branch) => {
    const response = await getListAccountOwnerCustomer(token, branch);
    setAccount(response?.data.data.accounts);
  });

  useEffect(() => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    setBrMode(branch.br_mode);
    getListAccountAPI(token, branch)
    setInStock("out");
    dispatch(setShowItems(false));
  }, []);


  const optionsAccount = account.map((d) => ({
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
    <div className="container-fluid">
      <div className="iq-card">
        <div className="card-body">
          <Row className="border-bottom">
            <Col md={8}><h4 className="text-danger">Stok Keluar</h4></Col>
            <Col md={4}>
              <Button
                variant="default border"
                className="float-right"
                onClick={() => router.push("/team/stockout/sm")}
              >
                <i className="fa fa-plus"></i>
                Tambah Transaksi Yang Hilang
              </Button>
            </Col>
            <Col md={3} className="p-2 mb-2">

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
            <Col xs={12} md={6} className="mb-4 mt-4">
              <label htmlFor="validationDefault04">
                <h5>Stok Tersimpan</h5>
              </label>
              <StockOutForm item={items} brMode={brMode} />
            </Col>
            <StockFormItem
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
