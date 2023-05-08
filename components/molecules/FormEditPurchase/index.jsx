import "bootstrap-daterangepicker/daterangepicker.css";
import { Number } from "components";
import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import { setEditDataPurchase } from "redux/action/purchase";
import { getListAccount } from "services/account";
import { setUpdateDetailPurchase } from "services/purchase";

export default function FormEditPurchase({ idx, purchase, bundle }) {
  const [filterData, setFilterData] = useState(bundle);
  const [qword, setQword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectAccount, setSelectAccount] = useState("");
  const [account, setAccount] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let { editDataPurchase } = useSelector((state) => state.purchaseReducer);

  const IMG = process.env.NEXT_PUBLIC_IMG;
  const router = useRouter();
  const dispatch = useDispatch();

  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setQword(searchWord);

    const newFilter = filterData.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilterData(bundle);
    } else {
      setFilterData(newFilter);
    }
  };

  const onCancel = () => {
    router.push(`/team/purchase/detail/${idx}`);
  };

  const countFormData = editDataPurchase.length;

  let purchaseItems = [];
  const onSubmit = async () => {
    editDataPurchase.map((m) => {
      const id_relation = m.type === 'Item' ? m.id_item : m.id_bundle;
      purchaseItems.push({
        type: m.type,
        id: m.id,
        pur_idx: idx,
        id_relation: id_relation,
        qty: m.qty,
        cost: m.cost
      });
    });

    const date_purchase = datePurcahse;
    const date_delivery = dateDelivery;
    const ac_idx = selectAccount === "" ? purchase?.ac_idx : selectAccount.value;
    const pur_idx = idx;

    const form = {
      token,
      branch,
      pur_idx,
      ac_idx,
      date_purchase,
      date_delivery,
      purchaseItems,
    };

    setIsLoading(true);
    const response = await setUpdateDetailPurchase(form, token);
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.data.data.message);
      router.push(`/team/purchase/detail/${idx}`);
    }

  };

  const sumTotalQty = _.sumBy(editDataPurchase, function (m) {
    return parseFloat(m.qty);
  });

  const sumTotalCost = _.sumBy(editDataPurchase, function (m) {
    let totalQty = parseFloat(m.qty);
    let totalCost = parseFloat(m.cost);
    return parseFloat(totalQty * totalCost);
  });

  const getListAccountAPI = useCallback(async (token, branch) => {
    setIsLoading(true);
    const response = await getListAccount(token, branch);
    setIsLoading(false);
    setAccount(response?.data.data.accounts);
  });

  useEffect(() => {
    getListAccountAPI(token, branch);
  }, []);
  let optionsAccount = account.map((d) => ({
    value: d.ac_idx,
    label: d.ac_name,
  }));

  const [datePurcahse, setDatePurcahse] = useState(
    moment().format("MM/DD/YYYY")
  );
  const [dateDelivery, setDateDelivery] = useState(
    moment().format("MM/DD/YYYY")
  );

  const changeHandlerQty = (id) => (event) => {
    const { value } = event.target;
    const qtyItem = value === "" ? 0 : value;

    const newState = editDataPurchase.map((obj) => {
      if (obj.id === id) {
        return { ...obj, qty: qtyItem };
      }
      return obj;
    });
    dispatch(setEditDataPurchase(newState));
  };

  const changeHandlerCost = (id) => (event) => {
    const { value } = event.target;
    const cost = value === "" ? 0 : value;

    const newState = editDataPurchase.map((obj) => {
      if (obj.id === id) {
        return { ...obj, cost: cost };
      }
      return obj;
    });
    dispatch(setEditDataPurchase(newState));
  };

  const checkItemExist = (id, array) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        return array[i];
      }
      if (array[i].id_bundle === id) {
        return array[i];
      }
      if (array[i].id_item === id) {
        return array[i];
      }
    }
  }

  const selectItem = (obj) => (value) => {
    const exist = checkItemExist(value, editDataPurchase);
    if (exist === undefined) {
      const selectedItem = {
        id: obj.id,
        type: obj.type,
        id_bundle: obj.id_bundle,
        id_item: obj.id_item,
        image: obj.image,
        name: obj.name,
        cost: obj.cost,
        stock: obj.stock,
        qty: obj.qty,
        price: obj.price,
        total: obj.qty * obj.cost,

      };
      dispatch(setEditDataPurchase([...editDataPurchase, selectedItem]));
    } else {
      const newState = editDataPurchase.map((obj) => {
        if (obj.id === value) {
          return { ...obj, qty: obj.qty + 1 };
        }
        if (obj.id_bundle === value) {
          return { ...obj, qty: obj.qty + 1 }
        }
        if (obj.id_item === value) {
          return { ...obj, qty: obj.qty + 1 }
        }
        return obj;
      });
      dispatch(setEditDataPurchase(newState));
    }

  };


  const removeItemAll = () => {
    dispatch(setEditDataPurchase([]));
  }


  const removeItem = (id) => {
    const aftarRemove = editDataPurchase.filter((x) => {
      if (x.id != id) {
        return x.id != id;
      }
      if (x.id_bundle != id) {
        return x.id != id;
      }
      if (x.id_item != id) {
        return x.id != id;
      }
    });

    dispatch(setEditDataPurchase(aftarRemove));
  };

  function ButtonAction() {
    return (
      <Row>
        <Col md={6}>
          {isLoading ? (
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            </Button>
          ) : (
            <>
              <Button
                type="reset"
                variant="default"
                className="border ml-2 mt-3 mr-2"
                onClick={onCancel}
              >
                Batal
              </Button>
              {editDataPurchase.length === 0 ? (
                <Button
                  type="submit"
                  className="btn btn-primary mt-3"
                  onClick={onSubmit}
                  disabled
                >
                  Simpan
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="btn btn-primary mt-3"
                  onClick={onSubmit}
                >
                  Simpan
                </Button>
              )}
            </>
          )}
        </Col>
      </Row>
    );
  }

  return (
    <div className="container-fluid">
      <Row>
        <div className="col-md-12">
          <div className="iq-card">
            <div className="iq-card-body">
              <Row>
                <div className="col-md-8">
                  <div className="iq-header-title">
                    <span>Pembelian & Penjualan</span>
                    <h4 className="card-title text-primary">
                      Pesanan Pembelian Baru
                    </h4>
                  </div>
                </div>
              </Row>

              <Col
                md={12}
                className="justify-content-between border-bottom p-2 mb-2"
              ></Col>
              {isLoading ? (
                <div className="row mt-4">
                  <div className="col-md-12 mt-4 d-flex justify-content-center">
                    <Spinner
                      as="span"
                      animation="border"
                      size="lg"
                      role="status"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <Row>
                    <Col md={12}>
                      <Row>
                        <Col md={2} className="mt-2">
                          <h6>Akun</h6>
                        </Col>
                        <Col md={3}>
                          <Select
                            defaultValue={{ label: purchase?.ac_name, value: purchase?.ac_idx }}
                            options={optionsAccount}
                            placeholder={"Pilih"}
                            isClearable={true}
                            onChange={setSelectAccount.bind(this)}
                            instanceId
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col md={12}>
                      <Row>
                        <Col md={2} className="mt-2">
                          <h6>Tanggal Pembelian</h6>
                        </Col>
                        <Col md={3}>
                          <DateRangePicker
                            initialSettings={{
                              singleDatePicker: true,
                              showDropdowns: true,
                              datePurcahse,
                              startDate: moment(
                                purchase?.pur_date_purchase
                              ).format("MM/DD/YYYY"),
                            }}
                            value={datePurcahse}
                            onApply={(event) =>
                              setDatePurcahse(event.target.value)
                            }
                          >
                            <input type="text" className="form-control" />
                          </DateRangePicker>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={12}>
                      <Row>
                        <Col md={2} className="mt-2">
                          <h6>Tanggal Pengiriman</h6>
                        </Col>
                        <Col md={3}>
                          <DateRangePicker
                            initialSettings={{
                              singleDatePicker: true,
                              showDropdowns: true,
                              dateDelivery,
                              startDate: moment(
                                purchase?.pur_date_delivery
                              ).format("MM/DD/YYYY"),
                            }}
                            value={dateDelivery}
                            onApply={(event) =>
                              setDateDelivery(event.target.value)
                            }
                          >
                            <input type="text" className="form-control" />
                          </DateRangePicker>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <div className="mb-4"></div>
                  <Row>
                    <table className="table table-hover border-bottom">
                      <thead>
                        <tr>
                          <th>
                            <i
                              className="fa fa-times-circle"
                              style={{ cursor: "pointer" }}
                              onClick={() => removeItemAll()}
                            ></i>
                          </th>
                          <th className="col-5">Item</th>
                          <th>Quantity</th>
                          <th>Biaya</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editDataPurchase.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <i
                                className="fa fa-times-circle"
                                style={{ cursor: "pointer" }}
                                onClick={() => removeItem(item.id)}
                              ></i>
                            </td>
                            <td>
                              {item.image ? (
                                <img
                                  src={`${IMG}/${item.image}`}
                                  width="35"
                                  height="35"
                                  className="rounded-top rounded-bottom"
                                />
                              ) : (
                                <img
                                  src="/icon/broken_image.svg"
                                  width="35"
                                  height="35"
                                  className="rounded-top rounded-bottom"
                                />
                              )}
                              {item.type === "Bundel" ? (
                                <span className="badge bg-secondary ml-3">
                                  {item.type}
                                </span>
                              ) : (
                                <span className="badge bg-warning ml-3">
                                  {item.type}
                                </span>
                              )}
                              <span className="ml-2">{item.name}</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                value={item.qty}
                                name="qty"
                                className="form-control"
                                onChange={(e) => changeHandlerQty(item.id)(e)}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.cost}
                                name="cost"
                                className="form-control"
                                onChange={(e) => changeHandlerCost(item.idx)(e)}
                              />
                            </td>
                            <td className="text-right">
                              <strong>
                                <Number value={item.qty * item.cost} />
                              </strong>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td></td>
                          <td>
                            <strong><span className="text-primary">{countFormData}</span> Item</strong>
                          </td>
                          <td>
                            <strong>
                              Total Quantity{" "}
                              <span className="text-primary"> {sumTotalQty} </span>
                            </strong>
                          </td>
                          <td></td>
                          <td className="text-rigth">
                            <strong>
                              Total Biaya{" "}
                              <span className="text-primary">
                                <Number value={sumTotalCost} />
                              </span>
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={5}
                            style={{ cursor: "pointer" }}
                            className="text-primary"
                            onClick={handleShow}
                          >
                            <i className="fa fa-plus"></i> Tambah Item
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Row>
                  <Row>
                    <Col>
                      <ButtonAction />
                    </Col>
                  </Row>
                </>
              )}
            </div>
          </div>
        </div>
      </Row>
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        centered
        aria-labelledby="example-modal-sizes-title-lg"
        size="lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            Pilih Item
          </Modal.Title>
          <Button variant="default" onClick={handleClose}>
            <i className="fa fa-close"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <input
                type="text"
                value={qword}
                className="form-control mb-3"
                placeholder="Cari item"
                onChange={handleFilter}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th></th>
                    <th scope="col">Type</th>
                    <th scope="col">Biaya</th>
                    <th scope="col">Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {filterData.length != 0 &&
                    filterData.slice(0, 5).map((value, key) => {
                      return (
                        <tr
                          key={value.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => selectItem(value)(value.id)}
                        >
                          <td>
                            {value.image ? (
                              <img
                                src={`${IMG}/${value.image}`}
                                width="50"
                                height="50"
                                className="rounded-top rounded-bottom"
                              />
                            ) : (
                              <img
                                src="/icon/broken_image.svg"
                                width="50"
                                height="50"
                                className="rounded-top rounded-bottom"
                              />
                            )}
                          </td>
                          <td>
                            {value.name}
                            <br />
                            <strong
                              style={{ fontSize: 12 }}
                              className="text-secondary"
                            >
                              <Number value={value.cost} /> /
                              <Number value={value.price} />
                              {value.type === "Bundel" ? "" : " / "}
                              {value.category}
                            </strong>
                          </td>
                          <td>
                            {value.type === "Bundel" ? (
                              <span className="badge bg-secondary">
                                {value.type}
                              </span>
                            ) : (
                              <span className="badge bg-warning">
                                {value.type}
                              </span>
                            )}
                          </td>
                          <td>
                            <Number value={value.cost} />
                          </td>
                          <td>{value.stock}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}
