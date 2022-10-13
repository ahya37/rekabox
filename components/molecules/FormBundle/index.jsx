import { LinkedItem, Number } from "components";
import Cookies from "js-cookie";
import _ from "lodash";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setSelectItemBundle } from "redux/action/item";
import { setSaveBundle } from "services/purchase";
import { generate } from "utils/randomstring";
import styles from "../../../styles/Fileupload.module.css";

export default function FormBundle(props) {
  const { item } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState(item);
  const [qword, setQword] = useState("");
  const [createForm, setCreateForm] = useState(true);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  let dispatch = useDispatch();
  const IMG = process.env.NEXT_PUBLIC_IMG;
  const router = useRouter();

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setQword(searchWord);

    const newFilter = item.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilterData(item);
    } else {
      setFilterData(newFilter);
    }
  };

  const onSelectedItem = (value) => {
    setSelected([...selected, value]);
  };

  const unSelectedItem = (value) => {
    data = data.filter(function (f) {
      return f !== value;
    });
    setSelected(data);
  };

  const changeHandler = (id) => (event) => {
    const { value } = event.target;
    const qtyItem = value === "" ? 0 : value;

    const newState = data.map((obj) => {
      if (obj.id === id) {
        return { ...obj, count: qtyItem };
      }
      return obj;
    });
    setSelected(newState);
  };
  const data = _.uniq(selected);
  const countItem = data.length;
  let sum = _.sumBy(data, function (m) {
    return parseFloat(m.count);
  });

  const onDone = () => {
    if (data.length === 0) {
      toast.error("Silahkan pilih item terlebih dahulu !");
    } else {
      dispatch(setSelectItemBundle(data));
      setCreateForm(false);
    }
  };

  const onCancel = () => {
    data = [];
    setSelected(data);
    dispatch(setSelectItemBundle(data));
    router.push("/team/bundle");
  };

  const generateString = () => {
    const randomString = generate(10);
    setBarcode(randomString);
  };

  let arrayBundle = [];
  const onSubmit = async () => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    data.map((m) => {
      arrayBundle.push({
        id: m.id,
        qty: parseFloat(m.count),
      });
    });

    const form = {
      name,
      barcode,
      cost,
      price,
      note,
      token,
      branch,
      arrayBundle,
    };

    setIsLoading(true);
    const response = await setSaveBundle(form, token);
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
    } else {
      const userProfile = response.data;
      toast.success("Bundel telah disimpan");
      router.push("/team/bundle");
    }
  };

  function ButtonAction() {
    return (
      <Row>
        <Col md={6}>
          {createForm ? (
            <Button
              type="submit"
              className="btn btn-primary mt-3"
              onClick={onDone}
            >
              Selesai
            </Button>
          ) : isLoading ? (
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
            <Button
              type="submit"
              className="btn btn-primary mt-3"
              onClick={onSubmit}
            >
              Simpan
            </Button>
          )}
          {isLoading ? (
            ""
          ) : (
            <Button
              type="reset"
              variant="default"
              className="border ml-2 mt-3"
              onClick={onCancel}
            >
              Batal
            </Button>
          )}
        </Col>
      </Row>
    );
  }

  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="iq-card-body">
          {createForm ? (
            <Fragment>
              <Row>
                <div className="col-md-12">
                  <div className="iq-card">
                    <div className="iq-card-body d-flex justify-content-between border-bottom">
                      <div className="iq-header-title">
                        <span>Pembelian & Penjualan</span>
                        <h4 className="card-title text-primary">
                          Tambah Bundel
                        </h4>
                        <span>
                          Silakan item untuk didaftarkan sebagai bundel.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Col md={6}>
                  <Col md={12}>
                    <Row>
                      <Col md={12}>
                        <label>
                          <h5>Pilih Item</h5>
                        </label>
                      </Col>
                    </Row>
                  </Col>
                  <Row>
                    <Col>
                      <input
                        type="text"
                        className="col-md-12 form-control mb-3"
                        placeholder="Cari nama item ..."
                        value={qword}
                        onChange={handleFilter}
                      />
                    </Col>
                  </Row>
                  {filterData.length != 0 &&
                    filterData.slice(0, 5).map((value, key) => {
                      return (
                        <Row
                          style={{ cursor: "pointer" }}
                          key={value.id}
                          onClick={() => onSelectedItem(value)}
                        >
                          <Col>
                            <ul className="col-md-12 list-group list-group-flush border-bottom">
                              <li className="list-group-item p-1">
                                <Row>
                                  <Col md={1}>
                                    {value.image !== "NULL" ? (
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
                                  <Col md={8} className="ml-3">
                                    <span className="text-dark">
                                      {value.name}
                                    </span>
                                    <br />
                                    <strong
                                      style={{ fontSize: 12 }}
                                      className="text-secondary"
                                    >
                                      <Number value={value.detail.cost} /> /{" "}
                                      <Number value={value.detail.price} /> /{" "}
                                      {value.detail.category}
                                    </strong>
                                  </Col>
                                  <Col md={2}>
                                    <span className="text-primary float-right mt-3">
                                      {value.stock}
                                    </span>
                                  </Col>
                                </Row>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      );
                    })}
                </Col>
                <Col md={6}>
                  <Col md={12}>
                    <Row>
                      <Col md={12}>
                        <label>
                          <h5>Item dan Qty</h5>
                        </label>
                      </Col>
                    </Row>
                  </Col>
                  {data.length === 0 ? (
                    <Row>
                      <Col md={12}>
                        <p className="text-center">Pilih item dan quantity</p>
                      </Col>
                    </Row>
                  ) : (
                    data.map((m) => (
                      <Row key={m.id}>
                        <Col>
                          <ul className="col-md-12 list-group list-group-flush border-bottom mt-1">
                            <li className="list-group-item p-0">
                              <Row>
                                <Col md={1}>
                                  {m.image !== "NULL" ? (
                                    <img
                                      src={`${IMG}/${m.image}`}
                                      width="50"
                                      height="50"
                                      className="rounded-top rounded-bottom mr-1"
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
                                <Col md={6} className="ml-3 mb-1">
                                  <span className="text-dark">{m.name}</span>
                                  <br />
                                  <strong
                                    style={{ fontSize: 12 }}
                                    className="text-secondary"
                                  >
                                    <Number value={m.detail.cost} /> /{" "}
                                    <Number value={m.detail.price} /> /{" "}
                                    {m.detail.category}
                                  </strong>
                                </Col>
                                <Col md={3}>
                                  <input
                                    className="form-control form-control-sm mt-2"
                                    type="number"
                                    value={m.count}
                                    onChange={(e) => changeHandler(m.id)(e)}
                                  />
                                </Col>
                                <Col md={1}>
                                  <img
                                    src="/icon/close.svg"
                                    className="float-right mt-3"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => unSelectedItem(m)}
                                  />
                                </Col>
                              </Row>
                            </li>
                          </ul>
                        </Col>
                      </Row>
                    ))
                  )}
                </Col>
              </Row>
              <Row className="mt-4 mb-4"></Row>
              <Row>
                <Col md={6}></Col>
                <Col md={6}>
                  <Row>
                    <Col>
                      <h5>
                        Total : <strong>Produk : {countItem}</strong>
                      </h5>
                    </Col>
                    <Col md={3}>
                      <h5 className="float-right">Total : {sum}</h5>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={12}></Col>
              </Row>
              <ButtonAction />
            </Fragment>
          ) : (
            <Fragment>
              <Row>
                <div className="col-md-12">
                  <div className="iq-card">
                    <div className="iq-card-body d-flex justify-content-between">
                      <div className="iq-header-title">
                        <span>Pembelian & Penjualan</span>
                        <h4 className="card-title text-primary">
                          Tambah Bundel
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <Col md={7}>
                  <Row>
                    <Col md={12} className="border-bottom ml-4 mb-3">
                      <h5>Info</h5>
                    </Col>
                  </Row>
                  <div className="col-md-12">
                    <label>
                      Nama Bundel{" "}
                      <sup className={styles["text-required"]}>*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                  <Col md={12} className="mt-3">
                    <Row>
                      <div className="col-10">
                        <label htmlFor="validationDefault02">Barcode</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Silahkan generate jika ingin menggunakan barcode"
                          value={barcode}
                          onChange={(event) => setBarcode(event.target.value)}
                        />
                      </div>
                      <div className="col-1 mt-3">
                        <div className="mt-3"></div>
                        <Button variant="primary" onClick={generateString}>
                          <i className="fa fa-random" aria-hidden="true"></i>
                        </Button>
                      </div>
                    </Row>
                  </Col>
                  <div className="col-md-12 mb-3 mt-3">
                    <label>Biaya</label>
                    <input
                      type="number"
                      className="form-control"
                      value={cost}
                      onChange={(event) => setCost(event.target.value)}
                    />
                  </div>
                  <div className="col-md-12 mb-3 mt-3">
                    <label>Harga</label>
                    <input
                      type="number"
                      className="form-control"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                    />
                  </div>
                  <div className="col-md-12 mb-3 mt-3">
                    <label>Note</label>
                    <input
                      type="text"
                      className="form-control"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  </div>
                </Col>
                <Col md={5}>
                  <Row className="border-bottom mr-1 mb-4">
                    <Col md={10}>
                      <h5>Item Terkait</h5>
                    </Col>
                    <Col md={1} className="float-right ml-4">
                      <Button
                        variant="link"
                        onClick={() => setCreateForm(true)}
                      >
                        <i className="fa fa-pencil"></i>
                      </Button>
                    </Col>
                  </Row>
                  <LinkedItem data={data} />
                </Col>
              </Row>
              <Col>
                <ButtonAction />
              </Col>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
