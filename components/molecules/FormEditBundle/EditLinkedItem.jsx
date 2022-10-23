import { Number } from "components";
import Cookies from "js-cookie";
import _ from "lodash";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setSelectItemBundle } from "redux/action/item";
import { setUpdateItemBundle } from "services/purchase";
import { toast } from "react-toastify";

export default function EditLinkedItem(props) {
  const { idx, item, dataEdit } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState(item);
  const [qword, setQword] = useState("");
  let [selected, setSelected] = useState([]);
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


  const checkItemExist = (id, array) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].it_idx === id) {
        return array[i];
      }
    }
  }

  const onSelectedItem = (obj) => (value) => {
    const exist = checkItemExist(value, selected);
    if (exist === undefined) {
      const newSelectedItems = {
        id: obj.id,
        image: obj.image,
        it_idx: obj.id,
        name: obj.name,
        barcode: obj.barcode,
        count: obj.count,
        detail: {
          category: obj.detail.category,
          cost: obj.detail.cost,
          price: obj.detail.price
        }
      };
      setSelected([...selected, newSelectedItems]);
    } else {
      const newSelectedItems = selected.map((obj) => {
        if (obj.it_idx === value) {
          let newQty = obj.count + 1;
          return { ...obj, count: parseFloat(newQty) }
        }
        return obj;
      });
      setSelected(newSelectedItems);
    }

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

  let items = [];
  const onSubmit = async () => {
    const token = Cookies.get("token");
    selected.map((m) => {
      items.push({
        id: m.it_idx,
        qty: parseFloat(m.count),
      });
    });

    const form = {
      token,
      ib_idx: idx,
      items,
    };
    setIsLoading(true);
    const response = await setUpdateItemBundle(form, token);
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success("Bundel telah di ubah");
      router.push("/team/bundle");
    }
  };

  const countItem = selected.length;
  let sum = _.sumBy(selected, function (m) {
    return parseFloat(m.count);
  });

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
        <div className="card-body">
          <span>Pembelian & Penjualan</span>
          <h4 className="card-title text-primary">Edit Bundel</h4>
          <Row className="border-bottom mb-2">
            <Col md={6}>
              <h5>Pilih Item</h5>
            </Col>
            <Col md={6}>
              <h5>Item dan Qty</h5>
            </Col>
          </Row>
          <Fragment>
            <Row>
              <Col md={6}>
                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder="Cari nama item"
                  value={qword}
                  onChange={handleFilter}
                />
                {filterData.length != 0 &&
                  filterData.slice(0, 5).map((value, key) => {
                    return (
                      <Row
                        style={{ cursor: "pointer" }}
                        key={value.id}
                        onClick={() => onSelectedItem(value)(value.id)}
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
