import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getChekAuth } from "services/auth";
import { ClearRedux } from "services/redux";
import {
    getDetailSales, setDeleteSalesDetail, setSaveAllStockOutSales
} from "services/sales";
import Swal from "sweetalert2";
import {
    DateFormat,
    DateTimeFormat,
    Navbar,
    Number,
    Sidebar
} from "../../../components";

export default function Detail(props) {
    const { idx } = props;
    const dispatch = useDispatch();
    const [data, setData] = useState({
        sales: {
            sal_idx: "",
            ac_name: "",
            sal_date_sales: "",
            sal_status: "",
            count_total: "",
            count_qty: "",
        },
        countItem: "",
        countItemOrderItem: "",
        totalQtyBYItem: "",
        detailItem: [],
        detailItemOrderItem: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [note, setNote] = useState("");
    const [itemStockMinus, setItemStockMinus] = useState([]);
    const [notifStockMinus, setNotifStockMinus] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const router = useRouter();

    const handleChange = () => {
        setChecked(!checked);
    };

    const IMG = process.env.NEXT_PUBLIC_IMG;

    const getDetailSalesAPI = useCallback(async (token, branch, idx) => {
        setIsLoading(true);
        const result = await getDetailSales(token, branch, idx);
        setIsLoading(false);
        setData(result?.data.data);
    }, []);

    useEffect(() => {
        const token = Cookies.get("token");
        const branch = Cookies.get("branch");
        getDetailSalesAPI(token, branch, idx);
        dispatch(ClearRedux());
    }, []);

    function ButtonUpdateStatusOrder(props) {
        let sal_idx = [];
        const { status, id } = props;
        const onUpdateStatusOrder = async (value) => {
            const token = Cookies.get("token");
            const branch = Cookies.get("branch");
            sal_idx.push({
                id: id
            });

            const { value: note } = await Swal.fire({
                input: 'textarea',
                inputLabel: 'Keluarkan stok yang terpilih',
                inputPlaceholder: 'Silahkan masukan notes / memo jika diperlukan',
                inputAttributes: {
                    'aria-label': 'Type your message here'
                },
                showCancelButton: true
            })

            if (note || !note) {
                const formData = {
                    token,
                    branch,
                    note,
                    sal_idx,
                };

                const response = await setSaveAllStockOutSales(formData, token);
                if (response.error) {
                    Swal.fire(response.message, "", "error");
                } else {
                    if (response?.data.data.item.length > 0) {
                        setShow(true)
                        setItemStockMinus(response.data.data.item);
                        setNotifStockMinus(response?.data.data.message);
                    } else {
                        Swal.fire(response.data.data.message, "", "success");
                        const branch = Cookies.get("branch");
                        getDetailSalesAPI(token, branch, idx);
                        dispatch(ClearRedux());
                    }
                }
            }
        };

        if (status === "In Transit") {
            return (
                <>
                    <Button
                        variant="primary"
                        onClick={() => onUpdateStatusOrder("Released")}
                    >
                        Stok Keluar
                    </Button>
                    <Button
                        variant="light"
                        className="border border-dark ml-2"
                        onClick={() => router.push("/team/sales")}
                    >
                        Kembali
                    </Button>
                </>
            );
        } else {
            return (
                <Button
                    variant="light"
                    className="border border-dark ml-2"
                    onClick={() => router.push("/team/sales")}
                >
                    Kembali
                </Button>
            );
        }
    }

    const onDelete = async (value) => {
        Swal.fire({
            text: "Hapus Penjualan ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = Cookies.get("token");
                const branch = Cookies.get("branch");
                const formData = new FormData();
                formData.append('token', token);
                formData.append('branch', branch);
                formData.append('sal_idx', value);
                setIsLoading(true);
                const response = await setDeleteSalesDetail(formData, token);
                setIsLoading(false);
                if (response.error) {
                    Swal.fire(response.message, "", "error");
                } else {
                    Swal.fire("Terhapus", "", "success");
                    router.push("/team/sales");
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
                                                    Pesanan Penjualan
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
                                                                        onClick={() => onDelete(data.sales.sal_idx)}
                                                                    ></i>
                                                                </div>

                                                                <div
                                                                    className="float-right mr-4"
                                                                    style={{ cursor: "pointer" }}
                                                                    title="Edit Pembelian"
                                                                >
                                                                    <i
                                                                        className="fa fa-pencil"
                                                                        onClick={() => router.push(`/team/sales/edit/${data.sales.sal_idx}`)}
                                                                    ></i>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col className="justify-content-between p-0 mt-4">
                                                        <Row>
                                                            <Col md={4}>Akun</Col>
                                                            <Col md={6}>{data.sales.ac_name}</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md={4}>Tanggal Pembelian</Col>
                                                            <Col md={6}>
                                                                <DateFormat
                                                                    date={data.sales.sal_date_sales}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md={4}>Estimasi Tanggal Pengiriman</Col>
                                                            <Col md={6}>
                                                                <DateFormat
                                                                    date={data.sales.sal_estimated_date_stockout}
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
                                                                                    <th className="text-right">Harga Unit</th>
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
                                                                                            <Number value={item.dt_price} />
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
                                                                                                {data.sales.count_qty}
                                                                                            </strong>
                                                                                        </h5>
                                                                                    </td>
                                                                                    <td></td>
                                                                                    <td>
                                                                                        <h5 className="float-right">
                                                                                            <strong>
                                                                                                <Number
                                                                                                    value={
                                                                                                        data.sales.count_total
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
                                                                                            Jumlah
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
                                                                                                {item.dt_qty}
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
                                                                    {data.sales.sal_date_sales ? (
                                                                        <ul className="m-0 p-0 job-classification">
                                                                            <li className="">
                                                                                <Row>
                                                                                    <Col md={1}>
                                                                                        <i className="ri-check-line bg-success rounded"></i>
                                                                                    </Col>
                                                                                    <Col md={10}>
                                                                                        <h5>
                                                                                            In Transit
                                                                                            <br />
                                                                                            <span>
                                                                                                <DateTimeFormat
                                                                                                    date={
                                                                                                        data.sales
                                                                                                            .sal_date_sales
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
                                                                    {data.sales.sal_date_released ? (
                                                                        <ul className="m-0 mb-4 p-0 job-classification">
                                                                            <li className="">
                                                                                <Row>
                                                                                    <Col md={1}>
                                                                                        <i className="ri-check-line bg-success rounded"></i>
                                                                                    </Col>
                                                                                    <Col md={10}>
                                                                                        <h5>
                                                                                            Rilis
                                                                                            <br />
                                                                                            <span>
                                                                                                {" "}
                                                                                                <DateTimeFormat
                                                                                                    date={
                                                                                                        data.sales
                                                                                                            .sal_date_released
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
                                                        status={data.sales.sal_status}
                                                        id={data.sales.sal_idx}
                                                    />

                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Row>
                    {itemStockMinus.length != 0 ? (
                        <Row>
                            <Modal
                                show={show}
                                onHide={handleClose}
                                animation={false}
                                centered
                                aria-labelledby="example-modal-sizes-title-lg"
                                size="lg"
                            >
                                <Modal.Header>
                                    <Modal.Title id="example-modal-sizes-title-md">
                                        {notifStockMinus}
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col md={12}>
                                            {itemStockMinus.map((m) => (
                                                <ul className="text-danger" key={m.id}>
                                                    <li>{m.name}</li>
                                                </ul>
                                            ))}
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" onClick={handleClose}>
                                        Tutup
                                    </Button>

                                </Modal.Footer>
                            </Modal>
                        </Row>

                    ) : (
                        ""
                    )}
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
