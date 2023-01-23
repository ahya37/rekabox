import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setDetailItem, setSelectItemLocation } from "redux/action/item";
import { FooterStockForm } from "..";
import {
  setSaveStockAuditItem,
  setSaveStockInItem
} from "../../../services/item";
import moment from "moment";



export default function StockOutFormItem(props) {
  const { title, countDesc, brlocIdx, brMode, account, location, date } = props;
  const { showItems, detailItem } = useSelector((state) => state.itemReducer);
  const { value } = showItems;
  const {
    it_idx,
    it_name,
    it_serial_number,
    it_image,
    ic_count,
    loc_name,
    loc_idx,
  } = detailItem;

  const [count, setCount] = useState(1);
  const [itIdx, setIdx] = useState("");
  const [desc, setDesc] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const IMG = process.env.NEXT_PUBLIC_IMG;

  const router = useRouter();
  const dispatch = useDispatch();

  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  const onSubmit = async () => {
    if (date === "" || date === null) {
      date = ""
    }
    else {
      date = moment(date).format('YYYY-MM-DD');
    }
    const useForm = {
      count,
      it_idx,
      token,
      optionLocIdx: brMode === 'Basic' ? brlocIdx : loc_idx,
      desc,
      branch,
      account: account.value === undefined ? "" : account.value,
      date
    };

    const data = new FormData();
    data.append("lc_itidx", useForm.it_idx);
    data.append("lc_count", useForm.count);
    data.append("in_desc", useForm.desc);
    data.append("lc_loidx", useForm.optionLocIdx);
    data.append("in_br_idx", useForm.branch);
    data.append("token", useForm.token);
    data.append("in_status", props.instock);
    data.append("in_account_idx", useForm.account);
    data.append("in_present_date", useForm.date);

    const response = "";
    if (props.instock === "audit") {
      setIsLoading(true);
      response = await setSaveStockAuditItem(data, token);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      response = await setSaveStockInItem(data, token);
      setIsLoading(false);
    }

    if (response.error) {
      toast.error(response.message);
    } else {
      dispatch(setDetailItem({}));
      dispatch(setSelectItemLocation({}));
      setCount(1);
      setIdx("");
      setDesc("");

      if (props.instock === "in") {
        toast.success("Stok masuk tersimpan");
        router.push("/team/stockin");
      } else if (props.instock === "out") {
        toast.success("Stok keluar tersimpan");
        router.push("/team/stockout");
      } else {
        toast.success("Stok Audit tersimpan");
        router.push("/team/audit");
      }

    }


  };

  const onCancel = () => {
    dispatch(setDetailItem({}));
    dispatch(setSelectItemLocation({}));
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
      <Col md={6} sm={12} xs={12} className="mt-4">
        {!it_idx ? (
          <div className="border-bottom text-center">
            Tidak ada item terpilih
          </div>
        ) : (
          <div>
            <Col md={12} xs={12} sm={12}>
              <Row>
                <Col md={12}>
                  <ul className="xlist-group list-group-flush p-0">
                    <li className="list-group-item p-0">
                      <Row>
                        <Col md={1} className="mr-4">
                          {it_image !== "NULL" ? (
                            <img
                              src={`${IMG}/${it_image}`}
                              width="60"
                              height="60"
                            />
                          ) : (
                            <img
                              src="/icon/broken_image.svg"
                              width="50"
                              height="50"
                            />
                          )}
                        </Col>
                        <Col md={9}>
                          <small>
                            {it_name} ({it_serial_number})
                          </small>
                          <br />
                          <small>{loc_name}</small>
                        </Col>
                        <Col md={1} xs={1} sm={1}>
                          <button
                            type="button"
                            className="btn btn-sm btn-default ml-2"
                            onClick={() =>
                              dispatch(setDetailItem({}))
                            }
                          >
                            <img src="/icon/close.svg" />
                          </button>
                        </Col>
                        <Col md={12} className="mt-2">
                          <div className="form-group">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={count}
                              onChange={(event) => setCount(event.target.value)}
                            />
                          </div>
                        </Col>
                        <Col md={12}>
                          <div className="form-group">
                            <textarea
                              value={desc}
                              onChange={(event) => setDesc(event.target.value)}
                              className="form-control"
                            />
                          </div>
                        </Col>
                        <Col md={12}>
                          <FooterStockForm
                            title={title}
                            countDesc={countDesc}
                            data={count}
                            icCount={ic_count}
                          />
                        </Col>
                        <Col md={12}>
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
                      </Row>
                    </li>
                  </ul>

                </Col>
              </Row>

            </Col>
          </div>
        )}
      </Col>
    </>
  );
}
