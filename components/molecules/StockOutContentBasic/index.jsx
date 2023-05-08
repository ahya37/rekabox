import { ModalFormAccount } from "components";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { setListAccount, setShowFormAccount } from "redux/action/account";
import { setShowItems } from "redux/action/item";
import { getListAccountCustomerOnly } from "services/account";
import { getListLocationItem } from "services/locationitem";
import {
  StockFormItem,
  StockOutForm
} from "../../molecules";

export default function StockOutContentBasic(props) {
  const { items } = props;
  const [inStock, setInStock] = useState("");
  const [brMode, setBrMode] = useState("");
  const [qword, setQword] = useState("");
  const [filterData, setFilterData] = useState(items);
  const [selectAccount, setSelectAccount] = useState("");
  const [brlocIdx, setBrlocIdx] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const { listAccount } = useSelector((state) => state.accountReducer);

  const handleShow = () => {
    dispatch(setShowFormAccount(true));
  };

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


  const getListAccountAPI = useCallback(async (token, branch) => {
    const response = await getListAccountCustomerOnly(token, branch);
    dispatch(setListAccount(response?.data.data.accounts))
  });

  const getLocationAPI = useCallback(async (token, branch) => {
    const response = await getListLocationItem(token, branch);
    setBrlocIdx(response?.data.data.location[0].loc_idx)
  });

  useEffect(() => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    
    setInStock("out");
    setBrMode(branch.br_mode);
    getListAccountAPI(token, branch)
    getLocationAPI(token, branch);
    dispatch(setShowItems(false));
  }, []);


  let optionsAccount = [{}];
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
        <i className="fa fa-plus"></i> Tambah Customer
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
                Stok Opname
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
                placeholder={"Customer"}
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
              <StockOutForm
                item={filterData} 
                brMode={brMode} />
            </Col>
            <StockFormItem
              instock={inStock}
              title="Stok Keluar"
              countDesc="Stok Keluar"
              account={selectAccount ?? ""}
              brlocIdx={brlocIdx}
              brMode="Basic"
            />
          </Row>
          <ModalFormAccount type="Customer" />
        </div>
      </div>
    </div>
  );
}
