import { Number } from "components";
import Cookies from "js-cookie";
import _ from "lodash";
import { useRouter } from "next/router";
import { Fragment, useState, useEffect } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setSelectItemBundle } from "redux/action/item";
import { setSaveBundle } from "services/purchase";
import { generate } from "utils/randomstring";

export default function EditLinkedItem(props) {
  const { item, dataEdit } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState(item);
  const [qword, setQword] = useState("");
  let [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  let dispatch = useDispatch();
  const IMG = process.env.NEXT_PUBLIC_IMG;
  const router = useRouter();

  useEffect(() => {
    setSelected(dataEdit);
  }, []);

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
    // setSelected([...selected, value]);
    // console.log("data: ", selected);
    const newArray = selected.some(function(m){
      return m.id === value.id;
    });
    console.log('newArray: ', newArray);
    console.log('selected: ', selected);
    // if(!newArray){
    //   setSelected([...selected, value]);
    // }
  };

  
  


  const unSelectedItem = (value) => {
    const newSelected = selected.filter(function (f) {
      return f !== value;
    });
    setSelected(newSelected);
  };

  const changeHandler = (id) => (event) => {
    const { value } = event.target;
    const qtyItem = value === "" ? 0 : value;

    const newState = selected.map((obj) => {
      if (obj.id === id) {
        return { ...obj, count: qtyItem };
      }
      return obj;
    });
    setSelected(newState);
  };

  const onCancel = () => {
    setSelected([]);
    dispatch(setSelectItemBundle([]));
    router.push("/team/bundle");
  };

  let arrayBundle = [];
  const onSubmit = async () => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    selected.map((m) => {
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
      toast.success("Bundel telah disimpan");
      router.push("/team/bundle");
    }
  };

  selected = _.uniq(selected);
  const countItem = selected.length;
  let sum = _.sumBy(selected, function (m) {
    return parseFloat(m.count);
  });

  console.log("data: ", selected);

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
                type="submit"
                className="btn btn-primary mt-3"
                onClick={onSubmit}
              >
                Simpan
              </Button>
              <Button
                type="reset"
                variant="default"
                className="border ml-2 mt-3"
                onClick={onCancel}
              >
                Batal
              </Button>
            </>
          )}
        </Col>
      </Row>
    );
  }

  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="iq-card-body">
          <Fragment>
            <Row>
              <div className="col-md-12">
                <div className="iq-card">
                  <div className="iq-card-body d-flex justify-content-between border-bottom">
                    <div className="iq-header-title">
                      <span>Pembelian & Penjualan</span>
                      <h4 className="card-title text-primary">Edit Bundel</h4>
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
                {selected.length === 0 ? (
                  <Row>
                    <Col md={12}>
                      <p className="text-center">Pilih item dan quantity</p>
                    </Col>
                  </Row>
                ) : (
                  selected.map((m) => (
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
        </div>
      </div>
    </div>
  );
}
