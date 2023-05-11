import "bootstrap-daterangepicker/daterangepicker.css";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setDetailHistory } from "../../../redux/action/history";
import { getDetailHistory } from "../../../services/history";
import { FormOrderHistoryStockOut, HistoryItem } from "../../molecules";
import { setReturItem } from "services/item";
import { setLoading } from "redux/action/item";

export default function HistoryStockOutContent() {
  const [brMode, setBrMode] = useState("");
  let { listHistories, detailHistory } = useSelector(
    (state) => state.HistoryReducer
  );
  let { loading } = useSelector(
    (state) => state.itemReducer
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [desc, setDesc] = useState("");

  const IMG = process.env.NEXT_PUBLIC_IMG;
  const dispatch = useDispatch();

  const historyItemDetail = async (value) => {
    const token = Cookies.get("token");
    const useForm = {
      token,
      inIdx: value,
    };


    const data = new FormData();
    data.append("token", useForm.token);
    data.append("in_idx", useForm.inIdx);
    setIsLoading(true);
    const response = await getDetailHistory(data, token);
    setIsLoading(false);
    if (response?.error) {
      toast.error(response?.message);
    } else {
      dispatch(setDetailHistory(response?.data.data.detailHistory))
    }
  };

  useEffect(() => {
    dispatch(setDetailHistory());
    const dataLocal = JSON.parse(localStorage.getItem('branch'));
    setBrMode(dataLocal.br_mode);
  }, []);

  function ViewCountQty() {
    if (detailHistory.in_status === "Stok Keluar") {
      return <span className="text-danger">-{detailHistory.in_count}</span>;
    }
    return <span className="text-primary">+{detailHistory.in_count}</span>;
  }

  const onRetur = async (id) => {
    const token = Cookies.get("token");
    const data = new FormData();
    data.append("in_idx", id);
    data.append("in_desc", desc);
    setIsLoadingButton(true);
    const response = await setReturItem(data, token)
    setIsLoadingButton(false);


    if (response.error) {
      toast.error(response.message);
    } else {
      dispatch(setDetailHistory());
      toast.success(response?.data.data.message);
    }
  }

  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="iq-card-body">
          <div className="col-md-9 col-sm-9">
            <div className="iq-header-title">
              <h4>Histori Stok Out</h4>
            </div>
          </div>
          <Row>
            <div className="col-md-12 col-sm-12">
              <div className="iq-card">
                <div className="iq-card-body border-bottom">
                  <FormOrderHistoryStockOut brMode={brMode} />
                </div>
              </div>
            </div>
            <Col xs={12} md={6} className="border-right">
              {loading ? (
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
                <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                  <div className="iq-card-body">
                    <ul className="doctors-lists m-0 p-0">
                      {listHistories.length === 0 ? (
                        <h5 className="text-center mt-4">Tidak ada data</h5>
                      ) : (
                        listHistories.map((item) => (
                          <div
                            key={item.in_idx}
                            onClick={() => historyItemDetail(item.in_idx)}
                          >
                            <HistoryItem
                              type={item.in_status}
                              date={item.in_create}
                              time={item.in_time}
                              qty={item.in_count}
                              member={item.user_fullname}
                              location={item.loc_name}
                            />
                          </div>
                        ))
                      )}
                    </ul>
                  </div>
                </div>

              )}
            </Col>
            <Col xs={12} md={6}>
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
              ) : detailHistory === undefined || Object.keys(detailHistory).length === 0 ? (
                ""
              ) : (
                <div className="iq-card">
                  <div className="iq-card-body">
                    <div className="iq-header-ti
                    tle border-bottom border-primary mb-2">
                      <Row>
                        <Col md={8} sm={8} xs={8}>
                          <h4 className="card-title text-primary">
                            {detailHistory.in_status}
                          </h4>
                        </Col>
                        <Col md={4} sm={4} xs={4}>
                          <h5 className="float-right">
                            {detailHistory.user_fullname}
                          </h5>
                        </Col>
                      </Row>
                    </div>
                    <Row>
                      <Col md={10} sm={9} xs={9}>
                        <h6>{detailHistory.loc_name}</h6>
                        <h6>
                          {detailHistory.in_create} - {detailHistory.in_time}
                        </h6>
                      </Col>
                     
                    </Row>
                    <Row>
                      <Col md={12} sm={12} xs={12}>
                        <div className="table-responsive mt-4">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th scope="col">Gambar</th>
                                <th scope="col">Nama</th>
                                <th scope="col">Seimbang</th>
                                <th scope="col">Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  {detailHistory.in_it_image !== "" ? (
                                    <img
                                      src={`${IMG}/${detailHistory.in_it_image}`}
                                      width={50}
                                      height={50}
                                    />
                                  ) : (
                                    <Image
                                      src="/icon/broken_image.svg"
                                      width={50}
                                      height={50}
                                    />
                                  )}
                                </td>
                                <td>{detailHistory.in_it_name}</td>
                                <td>
                                  {detailHistory.in_count_first}
                                  <i className="fa fa-arrow-right ml-3 mr-3"></i>
                                  {detailHistory.in_count_last}
                                </td>
                                <td>
                                  <ViewCountQty />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Col>
                      <Col md={12} sm={12} xs={12}>
                        <div className="form-group">
                        <label>Note :</label>
                        <textarea className="form-control mb-2" onChange={(event) => setDesc(event.target.value)}></textarea>
                          {isLoadingButton ? (
                             <Button variant="danger" disabled>
                             <Spinner
                               as="span"
                               animation="border"
                               size="sm"
                               role="status"
                               aria-hidden="true"
                             />
                           </Button>
                          ) : (
                            <Button variant="danger" onClick={() => onRetur(detailHistory.in_idx)}>Retur</Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
