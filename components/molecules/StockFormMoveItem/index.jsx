import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setDetailItem, setSelectItemLocation } from "redux/action/item";
import { setSaveMoveItem } from "../../../services/item";

export default function StockFormMoveItem(props) {
  const { showItems, fromLocIdx, detailItem } = useSelector(
    (state) => state.itemReducer
  );
  const { value } = showItems;
  const { locIdx } = fromLocIdx;
  const { it_idx, it_name, it_serial_number, it_image, lc_count, loc_name } =
    detailItem;
  const [count, setCount] = useState("");
  const [itIdx, setIdx] = useState("");
  const [desc, setDesc] = useState("");
  const [token, setToken] = useState("");
  const [fromLocIdxMove, setFromLocIdxMove] = useState("");
  const [toLocIdxMove, setToLocIdxMove] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const IMG = process.env.NEXT_PUBLIC_IMG;

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const tokens = Cookies.get("token");
    setToken(tokens);
    setIdx(it_idx);
    setFromLocIdxMove(locIdx);
    setToLocIdxMove(value);
  });

  const onSubmit = async () => {
    const branch = Cookies.get("branch");
    const useForm = {
      count,
      itIdx,
      token,
      fromLocIdxMove,
      toLocIdxMove,
      desc,
      branch
    };


    const data = new FormData();
    data.append("token", useForm.token);
    data.append("lc_itidx", useForm.itIdx);
    data.append("from_loc_idx", useForm.fromLocIdxMove);
    data.append("to_loc_idx", useForm.toLocIdxMove);
    data.append("lc_count", useForm.count);
    data.append("in_desc", useForm.desc);
    data.append("in_br_idx", useForm.branch);
    data.append("in_status", "move");

    setIsLoading(true);
    const response = await setSaveMoveItem(data, token);
    setIsLoading(false);

    if (response.error) {
      toast.error(response.message);
    } else {
      dispatch(setDetailItem({}))
      dispatch(setSelectItemLocation([]))
      setCount(null);
      setIdx("");
      setDesc("");
      toast.success("Stok pindah tersimpan");
      router.push("/team/stockmove");
    }
  };

  const onCancel = () => {
    dispatch(setDetailItem({}))
    dispatch(setSelectItemLocation([]))
    setCount(null);
    setIdx("");
    setDesc("");
  };

  const ButtonSubmit = () => {
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
  };

  return (
    <>
      <Col md={6} sm={12} xs={12}>
        <div className="card mt-3">
          <div className="card-body d-flex justify-content-between">
            <Col md={10} sm={10}>
              <div className="iq-header-title">
                <h4 className="card-title">Item Terpilih</h4>
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
