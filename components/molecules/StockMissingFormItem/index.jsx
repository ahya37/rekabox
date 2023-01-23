import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FooterStockForm } from "..";
import { setSaveStockMissingItem } from "../../../services/item";
import { toast } from "react-toastify";
import { setDetailItem, setFromDateStockMissing, setSelectItemLocation, setShowItems } from "redux/action/item";
import moment from "moment";

export default function StockMissingFormItem(props) {
  const { title, countDesc, brlocIdx, brMode, account } = props;
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

  const [count, setCount] = useState(1);
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const IMG = process.env.NEXT_PUBLIC_IMG;

  const router = useRouter();
  const dispatch = useDispatch();

  let locIdx = !value ? lc_loidx : value;

  const onSubmit = async () => {

    if (brMode === 'Basic') {
      locIdx = brlocIdx;
    }else{
      locIdx === undefined ? "" : locIdx;
    }

    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    const useForm = {
      account: account.value === undefined ? "" : account.value,
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
    data.append("lc_count", parseInt(useForm.count));
    data.append("in_desc", useForm.desc);
    data.append("lc_loidx", useForm.locIdx);
    data.append("token", useForm.token);
    data.append("in_status", props.instock);
    data.append("in_br_idx", useForm.branch);
    data.append("in_account_idx", useForm.account);
    data.append("date", useForm.formDateStockMissing); 


    setIsLoading(true);
    const response = await setSaveStockMissingItem(data, token);
    setIsLoading(false);

    if (response.error) {
      toast.error(response.message);
    } else {
      dispatch(setDetailItem({}));
      dispatch(setSelectItemLocation([]));
      dispatch(setFromDateStockMissing(moment().format("MM/DD/YYYY")));
      dispatch(setShowItems(false))
      setCount(1);
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
    dispatch(setDetailItem({}));
    dispatch(setSelectItemLocation([]));
    setCount(null);
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
          <div className="border-bottom">
            Tidak ada item terpilih
          </div>
        ) : (
          <Col md={12} xs={12} sm={12}>
            <ul className="xlist-group list-group-flush p-0">
              <li className="list-group-item p-0">
                <Row>
                  <Col md={1} className="mr-3">
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
                      className="btn btn-sm ml-3"
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
        )}
      </Col>
    </>
  );
}
