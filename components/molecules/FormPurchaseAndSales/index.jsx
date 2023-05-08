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
import Select from "react-select";
import { toast } from "react-toastify";
import { getListAccount } from "services/account";
import { setSavePurchase } from "services/purchase";
import { setSaveSales } from "services/sales";

export default function FormPurchaseAndSales({ items, type }) {
  const [filterData, setFilterData] = useState(items);
  const [qword, setQword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectAccount, setSelectAccount] = useState("");
  const [formData, setFormData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [datePurcahseSales, setdatePurcahseSales] = useState(
    moment().format("MM/DD/YYYY")
  );
  const [dateDeliveryStockOut, setdateDeliveryStockOut] = useState(
    moment().format("MM/DD/YYYY")
  );
  const [account, setAccount] = useState([]);

  const IMG = process.env.NEXT_PUBLIC_IMG;
  const router = useRouter();

  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setQword(searchWord);

    const newFilter = filterData.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilterData(items);
    } else {
      setFilterData(newFilter);
    }
  };

  const onCancel = () => {
    router.push("/team/sales");
  };

  let salesItems = [];
  let purchaseItems = [];
  const onSubmit = async () => {
    if (type === "purchase") {
      const ac_idx = selectAccount.value;
      formData.map((m) => {
        purchaseItems.push({
          type: m.type,
          id: m.id,
          name: m.name,
          qty: m.qty,
          cost: m.price,
        });
      });

      const date_purchase = datePurcahseSales;
      const date_delivery = dateDeliveryStockOut;

      const form = {
        ac_idx,
        date_purchase,
        date_delivery,
        token,
        branch,
        purchaseItems,
      };

      setIsLoading(true);
      const response = await setSavePurchase(form, token);
      setIsLoading(false);
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success(response.data.data.message);
        router.push("/team/purchase");
      }
    } else {
      const ac_idx = selectAccount.value;
      formData.map((m) => {
        salesItems.push({
          type: m.type,
          id: m.id,
          name: m.name,
          qty: m.qty,
          price: m.price,
        });
      });

      const date_sales = datePurcahseSales;
      const estimated_date_stokout = dateDeliveryStockOut;

      const form = {
        ac_idx,
        date_sales,
        estimated_date_stokout,
        token,
        branch,
        salesItems,
      };

      setIsLoading(true);
      const response = await setSaveSales(form, token);
      setIsLoading(false);
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success(response.data.data.message);
        router.push("/team/sales");
      }
    }
  };

  const sumTotalCost = _.sumBy(formData, function (m) {
    let totalQty = parseFloat(m.qty);
    let totalCost = parseFloat(m.price);
    return parseFloat(totalQty * totalCost);
  });

  const sumTotalQty = _.sumBy(formData, function (m) {
    return parseFloat(m.qty);
  });

  const countFormData = formData.length;

  const getListAccountAPI = useCallback(async (token, branch) => {
    const response = await getListAccount(token, branch);
    setAccount(response?.data.data.accounts);
  });

  useEffect(() => {
    getListAccountAPI(token, branch);
  }, []);

  let optionsAccount = account.map((d) => ({
    value: d.ac_idx,
    label: d.ac_name,
  }));

  const changeHandlerQty = (id) => (event) => {
    let { value } = event.target;
    let qty = value === "" ? 0 : value;

    const newState = formData.map((obj) => {
      if (obj.id === id) {
        return { ...obj, qty: parseFloat(qty), total: qty * obj.price };
      }
      return obj;
    });
    setFormData(newState);
  };

  const checkItemExist = (id, array) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        return array[i];
      }
    }
  };

  const selectItem = (obj) => (value) => {
    if (type === "purchase") {
      const exist = checkItemExist(value, formData);
      const { qty } = obj;
      const qtyItem = qty === 0 ? 1 : qty;

      if (exist === undefined) {
        const selectedItem = {
          type: obj.type,
          id: obj.id,
          image: obj.image,
          name: obj.name,
          qty: qtyItem,
          price: obj.detail.cost,
          total: qtyItem * obj.detail.cost,
        };

        setFormData([...formData, selectedItem]);
      } else {
        const newState = formData.map((obj) => {
          if (obj.id === value) {
            let qtyItem = obj.qty + 1;

            return {
              ...obj,
              qty: parseFloat(qtyItem),
              total: parseFloat(qtyItem) * obj.price,
            };
          }
          return obj;
        });

        setFormData(newState);
      }
    } else {
      const exist = checkItemExist(value, formData);
      const { qty } = obj;
      const qtyItem = qty === 0 ? 1 : qty;

      if (exist === undefined) {
        const selectedItem = {
          type: obj.type,
          id: obj.id,
          image: obj.image,
          name: obj.name,
          qty: qtyItem,
          price: obj.detail.price,
          total: qtyItem * obj.detail.price,
        };

        setFormData([...formData, selectedItem]);
      } else {
        const newState = formData.map((obj) => {
          if (obj.id === value) {
            let qtyItem = obj.qty + 1;
            return {
              ...obj,
              qty: parseFloat(qtyItem),
              total: qtyItem * obj.price,
            };
          }
          return obj;
        });

        setFormData(newState);
      }
    }
  };

  const removeItemAll = () => {
    setFormData([]);
  };

  const removeItem = (id) => {
    const aftarRemove = formData.filter((x) => {
      if (x.id != id) {
        return x.id != id;
      }
    });
    setFormData(aftarRemove);
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
                onClick={() => onCancel(true)}
              >
                Batal
              </Button>

              {formData.length === 0 ? (
                <Button type="submit" className="btn btn-primary mt-3" disabled>
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
              <Row>
                <Col md={12}>
                  <Row>
                    <Col md={2} className="mt-2">
                      <h6>Akun</h6>
                    </Col>
                    <Col md={3}>
                      <Select
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
                      <h6>
                        {type === "purchase"
                          ? "Tanggal Pembelian"
                          : "Tanggal Penjualan"}
                      </h6>
                    </Col>
                    <Col md={3}>
                      <DateRangePicker
                        initialSettings={{
                          singleDatePicker: true,
                          showDropdowns: true,
                          datePurcahseSales,
                        }}
                        value={datePurcahseSales}
                        onApply={(event) =>
                          setdatePurcahseSales(event.target.value)
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
                      <h6>
                        {type === "purchase"
                          ? "Estimasi Tanggal Terkirim"
                          : "Estimasi Tanggal Stok Keluar"}
                      </h6>
                    </Col>
                    <Col md={3}>
                      <DateRangePicker
                        initialSettings={{
                          singleDatePicker: true,
                          showDropdowns: true,
                          dateDeliveryStockOut,
                        }}
                        value={dateDeliveryStockOut}
                        onApply={(event) =>
                          setdateDeliveryStockOut(event.target.value)
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
                <Col>
                  <table className="table table-hover border-bottom">
                    <thead>
                      <tr>
                        <th>
                          <i
                            className="fa fa-times-circle"
                            style={{ cursor: "pointer" }}
                            onClick={removeItemAll}
                          ></i>
                        </th>
                        <th>Nama</th>
                        <th>Type</th>
                        <th className="text-right">Quantity</th>
                        <th className="text-right">Harga Unit</th>
                        <th className="text-right">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.map((m) => (
                        <tr key={m.id}>
                          <td>
                            <i
                              className="fa fa-times-circle"
                              style={{ cursor: "pointer" }}
                              onClick={() => removeItem(m.id)}
                            ></i>
                          </td>
                          <td>
                            {m.image ? (
                              <img
                                src={`${IMG}/${m.image}`}
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
                            <span className="ml-2">{m.name}</span>
                          </td>
                          <td>
                            {m.type === "Bundel" ? (
                              <span className="badge bg-secondary">
                                {m.type}
                              </span>
                            ) : (
                              <span className="badge bg-warning">{m.type}</span>
                            )}
                          </td>
                          <td className="text-center">
                            <input
                              type="number"
                              value={m.qty}
                              name="qty"
                              className="form-control"
                              onChange={(e) => changeHandlerQty(m.id)(e)}
                            />
                          </td>
                          <td className="text-right">
                            <Number value={m.price} />
                          </td>
                          <td className="text-right">
                            <Number value={m.total} />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td>
                          <strong>
                            <span className="text-primary">
                              {countFormData}
                            </span>{" "}
                            Item
                          </strong>
                        </td>
                        <td></td>
                        <td className="text-right">
                          <strong>
                            Total Quantity{" "}
                            <span className="text-primary">
                              {" "}
                              {sumTotalQty}{" "}
                            </span>
                          </strong>
                        </td>
                        <td></td>
                        <td className="text-right">
                          <strong>
                            Total Jumlah{" "}
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
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
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
                            <th scope="col">Type</th>
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
                                    <Row>
                                      <Col md={1}>
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
                                      </Col>
                                      <Col m={10} className="ml-3">
                                        {value.name}
                                        <br />
                                        <strong
                                          style={{ fontSize: 12 }}
                                          className="text-secondary"
                                        >
                                          <Number value={value.detail.cost} /> /
                                          <Number value={value.detail.price} />
                                          {value.type === "Bundel" ? "" : " / "}
                                          {value.category}
                                        </strong>
                                      </Col>
                                    </Row>
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
              <Row>
                <Col>
                  <ButtonAction />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
}
