import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Col, Row, Spinner, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getChekAuth } from "services/auth";
import {
  getDetailPurchase,
  setDeletePurchaseDetail,
  setUpdateStatusPurchaseByDetail,
} from "services/purchase";
import { ClearRedux } from "services/redux";
import {
  DateFormat,
  DateTimeFormat,
  Navbar,
  Number,
  Sidebar,
} from "../../../../components";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function Detail(props) {
  const { idx } = props;
  const dispatch = useDispatch();
  const [data, setData] = useState({
    purchase: {
      pur_idx: "",
      ac_name: "",
      pur_date_purchase: "",
      pur_date_delivery: "",
      pur_status: "",
      count_total: "",
      count_qty: "",
      pur_date_sent: "",
      pur_date_confirmed: "",
      pur_date_closed: "",
      pur_date_receiving: "",
    },
    countItem: "",
    countItemOrderItem: "",
    totalQtyBYItem: "",
    detailItem: [],
    detailItemOrderItem: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const handleChange = () => {
    setChecked(!checked);
  };

  const IMG = process.env.NEXT_PUBLIC_IMG;

  const getDetailPurchaseAPI = useCallback(async (token, branch, idx) => {
    setIsLoading(true);
    const result = await getDetailPurchase(token, branch, idx);
    setIsLoading(false);
    setData(result?.data.data);
  }, []);

  useEffect(() => {
    const token  = Cookies.get("token");
    const branch = Cookies.get("branch");
    getDetailPurchaseAPI(token, branch, idx);
    dispatch(ClearRedux());
  }, []);

  function ButtonUpdateStatusOrder(props) {
    const { status, id } = props;
    const onUpdateStatusOrder = async (value) => {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("token", token);
      formData.append("status", value);
      formData.append("pur_idx", id);
      setIsLoading(true);
      const response = await setUpdateStatusPurchaseByDetail(formData, token);
      setIsLoading(false);
      if (response.error) {
        toast.error(response.message);
      } else {
        Swal.fire(response.data.data.message, "", "success");
        const branch = Cookies.get("branch");
        getDetailPurchaseAPI(token, branch, idx);
        dispatch(ClearRedux());
      }
    };

    if (status === "Sent") {
      return (
        <Button
          variant="primary"
          onClick={() => onUpdateStatusOrder("Confirmed")}
        >
          Ubah Ke Konfirmasi
        </Button>
      );
    } else if (status === "Confirmed") {
      return (
        <Button
          variant="primary"
          onClick={() => onUpdateStatusOrder("Receiving")}
        >
          Ubah Ke Diterima
        </Button>
      );
    } else {
      return (
        <Button
          variant="primary"
          onClick={() => onUpdateStatusOrder("Receiving")}
        >
          <i className="fa fa-arrow-down"></i>
          Cek Stok In
        </Button>
      );
    }
  }

  const onDelete = async (value) => {
    Swal.fire({
      text: "Hapus Pembelian ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token    = Cookies.get("token");
        const branch   = Cookies.get("branch");
        const formData = new FormData();
        formData.append('token', token);
        formData.append('branch', branch);
        formData.append('pur_idx', value);
        setIsLoading(true);
        const response = await setDeletePurchaseDetail(formData, token);
        setIsLoading(false);
        if (response.error) {
          Swal.fire(response.message, "", "error");
        } else {
          Swal.fire("Terhapus", "", "success");
          router.push("/team/purchase");
        }
      }
    });
  };

  return (
    <div className="wrapper">
      <Sidebar activeMenu="bundle" />
      <div id="content-page" className="content-page">
        <Navbar />
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
                          Pesanan Pembelian
                        </h4>
                      </div>
                    </div>
                  </Row>
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
                        <Col md={8}>
                          <Col className="justify-content-between border-bottom p-2 mb-2"></Col>
                          <Col className="justify-content-between p-0">
                            <Row>
                              <Col md={6}>
                                <strong>Order Info</strong>
                              </Col>
                              <Col md={6}>
                                <div
                                  className="float-right"
                                  style={{ cursor: "pointer" }}
                                  title="Hapus Pembelian"
                                >
                                  <i
                                    className="fa fa-trash"
                                    onClick={() => onDelete(data.purchase.pur_idx)}
                                  ></i>
                                </div>
                               
                                <div
                                  className="float-right mr-4"
                                  style={{ cursor: "pointer" }}
                                  title="Edit Pembelian"
                                >
                                  <i
                                    className="fa fa-pencil"
                                    onClick={() => router.push(`/team/purchase/edit/${data.purchase.pur_idx}`)}
                                  ></i>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col className="justify-content-between p-0 mt-4">
                            <Row>
                              <Col md={4}>Akun</Col>
                              <Col md={6}>{data.purchase.ac_name}</Col>
                            </Row>
                            <Row>
                              <Col md={4}>Tanggal Pembelian</Col>
                              <Col md={6}>
                                <DateFormat
                                  date={data.purchase.pur_date_purchase}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col md={4}>Estimasi Tanggal Pengiriman</Col>
                              <Col md={6}>
                                <DateFormat
                                  date={data.purchase.pur_date_delivery}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col className="justify-content-between p-0 mt-4">
                            <Row>
                              <Col md={8}></Col>
                              <Col md={4}>
                                <strong className="float-right">
                                  <div className="custom-control custom-switch">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id="customSwitch1"
                                      onClick={() => handleChange()}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="customSwitch1"
                                    >
                                      Lihat Berdasarkan Item
                                    </label>
                                  </div>
                                </strong>
                              </Col>
                            </Row>
                            <Row>
                              {!checked ? (
                                <Col>
                                  <div className="table">
                                    <table className="table table-hovered">
                                      <thead>
                                        <tr>
                                          <th>Foto</th>
                                          <th>Nama</th>
                                          <th className="text-right">Type</th>
                                          <th className="text-right">
                                            Quantity
                                          </th>
                                          <th className="text-right">Unit Harga</th>
                                          <th>
                                            {" "}
                                            <span className="float-right">
                                              Total
                                            </span>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {data.detailItem.map((item) => (
                                          <tr key={item.idx}>
                                            <td>
                                              {item.it_image !== "NULL" ? (
                                                <img
                                                  src={`${IMG}/${item.it_image}`}
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
                                            </td>
                                            <td>{item.dt_item}</td>
                                            <td className="text-right">
                                              {item.dt_type === "Item" ? (
                                                <span className="badge bg-warning">
                                                  {item.dt_type}
                                                </span>
                                              ) : (
                                                <span className="badge bg-secondary">
                                                  {item.dt_type}
                                                </span>
                                              )}
                                            </td>
                                            <td className="text-right">
                                              {item.dt_qty}
                                            </td>
                                            <td className="text-right">
                                              <Number value={item.dt_cost} />
                                            </td>
                                            <td className="text-right">
                                              <Number value={item.dt_total} />
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                      <tfoot>
                                        <tr>
                                          <td>
                                            <h5>
                                              <strong>
                                                {data.countItem} Item
                                              </strong>
                                            </h5>
                                          </td>
                                          <td></td>
                                          <td></td>
                                          <td className="text-right">
                                            <h5>
                                              <strong>
                                                {data.purchase.count_qty}
                                              </strong>
                                            </h5>
                                          </td>
                                          <td></td>
                                          <td>
                                            <h5 className="float-right">
                                              <strong>
                                                <Number
                                                  value={
                                                    data.purchase.count_total
                                                  }
                                                />
                                              </strong>
                                            </h5>
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                </Col>
                              ) : (
                                <Col>
                                  <div className="table">
                                    <table className="table table-hovered">
                                      <thead>
                                        <tr>
                                          <th>Foto</th>
                                          <th>Nama</th>
                                          <th colSpan={5}>
                                            <strong className="float-right">
                                              Quantity Yang Masuk
                                            </strong>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {data.detailItemOrderItem.map(
                                          (item) => (
                                            <tr key={item.idx}>
                                              <td>
                                                {item.it_image !== null ? (
                                                  <img
                                                    src={`${IMG}/${item.it_image}`}
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
                                              </td>
                                              <td>{item.it_name}</td>
                                              <td
                                                colSpan={5}
                                                className="text-right"
                                              >
                                                {item.it_qty}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                      <tfoot>
                                        <tr>
                                          <td>
                                            <h5>
                                              <strong>
                                                {data.countItemOrderItem} Item
                                              </strong>
                                            </h5>
                                          </td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td>
                                            <h5 className="float-right">
                                              <strong>
                                                {data.totalQtyBYItem}
                                              </strong>
                                            </h5>
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                </Col>
                              )}
                            </Row>
                          </Col>
                        </Col>
                        <Col md={4} className="mt-2">
                          <div className="card shadow mb-3">
                            <div className="card-body">
                              <div className="card">
                                <div className="card-body">
                                  {data.purchase.pur_date_receiving ? (
                                    <ul className="m-0 p-0 job-classification">
                                      <li className="">
                                        <Row>
                                          <Col md={1}>
                                            <i className="ri-check-line bg-success rounded"></i>
                                          </Col>
                                          <Col md={10}>
                                            <h5>
                                              Diterima
                                              <br />
                                              <span>
                                                <DateTimeFormat
                                                  date={
                                                    data.purchase
                                                      .pur_date_receiving
                                                  }
                                                />
                                              </span>
                                            </h5>
                                          </Col>
                                        </Row>
                                      </li>
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                  {data.purchase.pur_date_confirmed ? (
                                    <ul className="m-0 mb-4 p-0 job-classification">
                                      <li className="">
                                        <Row>
                                          <Col md={1}>
                                            <i className="ri-check-line bg-success rounded"></i>
                                          </Col>
                                          <Col md={10}>
                                            <h5>
                                              Konfimasi
                                              <br />
                                              <span>
                                                {" "}
                                                <DateTimeFormat
                                                  date={
                                                    data.purchase
                                                      .pur_date_confirmed
                                                  }
                                                />
                                              </span>
                                            </h5>
                                          </Col>
                                        </Row>
                                      </li>
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                  {data.purchase.pur_date_sent ? (
                                    <ul className="m-0 mb-4 p-0 job-classification">
                                      <li className="">
                                        <Row>
                                          <Col md={1}>
                                            <i className="ri-check-line bg-success rounded"></i>
                                          </Col>
                                          <Col md={10}>
                                            <h5>
                                              Pesanan Terkirim
                                              <br />
                                              <span>
                                                <DateTimeFormat
                                                  date={
                                                    data.purchase.pur_date_sent
                                                  }
                                                />
                                              </span>
                                            </h5>
                                          </Col>
                                        </Row>
                                      </li>
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <ButtonUpdateStatusOrder
                            status={data.purchase.pur_status}
                            id={data.purchase.pur_idx}
                          />
                          <Button
                            variant="light"
                            className="border border-dark ml-2"
                            onClick={() => router.push("/team/purchase")}
                          >
                            Kembali
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, params }) {
  const idx = params.idx;
  const { token } = req.cookies;
  const auth = await getChekAuth(token);

  if (auth.error || !token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {
      idx,
    },
  };
}
