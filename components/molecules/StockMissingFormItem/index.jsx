import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FooterStockForm } from "..";
import { setSaveStockMissingItem } from "../../../services/item";
import { toast } from "react-toastify";

export default function StockMissingFormItem(props) {
  const { title, countDesc } = props;
  const { showItems, detailItem, formDateStockMissing } = useSelector(
    (state) => state.itemReducer
  );
  const { value } = showItems;
  const {
    it_idx,
    it_name,
    it_serial_number,
    it_image,
    ic_count,
    loc_name,
    lc_loidx,
  } = detailItem;

  const [count, setCount] = useState("1");
  const [itIdx, setIdx] = useState("");
  const [desc, setDesc] = useState("");
  const [inStock, setInStock] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const IMG = process.env.NEXT_PUBLIC_IMG;

  const router = useRouter();
  const dispatch = useDispatch();

  const locIdx = !value ? lc_loidx : value;

  const onSubmit = async () => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    const useForm = {
      count,
      it_idx,
      token,
      locIdx,
      desc,
      inStock: props.instock,
      formDateStockMissing,
      branch
    };

    const data = new FormData();
    data.append("lc_itidx", useForm.it_idx);
    data.append("lc_count", useForm.count);
    data.append("in_desc", useForm.desc);
    data.append("lc_loidx", useForm.locIdx);
    data.append("token", useForm.token);
    data.append("in_status", props.instock);
    data.append("in_br_idx", useForm.branch);
    data.append("date", useForm.formDateStockMissing);

    setIsLoading(true);
    const response = await setSaveStockMissingItem(data, token);
    setIsLoading(false);

    if (response.error) {
      toast.error(response.message);
    } else {
      dispatch({ type: "SET_DETAIL_ITEM", value: {} });
      dispatch({ type: "SET_ITEM_BY_LOCATION", value: [] });
      dispatch({
        type: "SET_USEFORM_DATE_STOCK_MISSING",
        value: "",
      });
      dispatch({ type: "SET_SHOW_ITEMS", value: false });
      setCount(null);
      setIdx("");
      setDesc("");

      if (props.instock === "in") {
        toast.success("Stok masuk hilang tersimpan");
        router.push("/team/stockin/sm");
      } else {
        toast.success("Stok keluar hilang tersimpan");
        router.push("/team/stockout/sm");
      }
    }
  };

  const onCancel = () => {
    dispatch({ type: "SET_DETAIL_ITEM", value: {} });
    dispatch({ type: "SET_ITEM_BY_LOCATION", value: [] });
    setCount(null);
    setIdx("");
    setDesc("");
  };

  function ButtonSubmit() {
    return (
      <>
        <Button type="submit" className="btn btn-primary" onClick={onSubmit}>
          Simpan
        </Button>
        <Button
          type="reset"
          variant="default"
          className="border ml-2"
          onClick={onCancel}
        >
          Batal
        </Button>
      </>
    );
  }

  return (
    <>
      <Col md={6} sm={12} xs={12}>
        <div className="card mt-3">
          <div className="card-body d-flex justify-content-between">
            <Col md={10} sm={10}>
              <div className="iq-header-title">
                <h5 className="card-title">{title}</h5>
              </div>
            </Col>
          </div>
          {!it_idx ? (
            <div className="card-body shadow border-bottom">
              Tidak ada item terpilih
            </div>
          ) : (
            <div className="card-body shadow border-bottom">
              <ul className="report-lists m-0 p-0">
                <Col md={12} xs={12} sm={12}>
                  <Row className="alert alert-secondary">
                    <Col md={2} xs={4} sm={4}>
                      {it_image !== "NULL" ? (
                        <img
                          src={`${IMG}/${it_image}`}
                          width="50"
                          height="50"
                        />
                      ) : (
                        <img
                          src="/icon/broken_image.svg"
                          width="50"
                          height="50"
                        />
                      )}
                    </Col>
                    <Col md={8} xs={8} sm={8}>
                      <div className="media-support-info">
                        <h6>
                          {it_name} ({it_serial_number})<br />
                          <small>{loc_name}</small>
                        </h6>
                      </div>
                    </Col>

                    <Col md={1} xs={1} sm={1} className="float-right">
                      <button
                        type="button"
                        className="btn btn-sm btn-default"
                        onClick={() =>
                          dispatch({ type: "SET_DETAIL_ITEM", value: {} })
                        }
                      >
                        <img src="/icon/close.svg" />
                      </button>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12} sm={12} xs={12} className="mt-3">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={count}
                          onChange={(event) => setCount(event.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          value={desc}
                          onChange={(event) => setDesc(event.target.value)}
                          className="form-control"
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="mt-2"></div>
                  <FooterStockForm
                    title={title}
                    countDesc={countDesc}
                    data={count}
                    icCount={ic_count}
                  />
                </Col>
              </ul>
            </div>
          )}
        </div>
      </Col>
      <Col md={12} sm={12} xs={12}>
        <div className="iq-card-body">
          <Col md={12} sm={12} xs={12} className="mt-2">
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
              <ButtonSubmit />
            )}
          </Col>
        </div>
      </Col>
    </>
  );
}
