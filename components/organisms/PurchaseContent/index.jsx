import { useRouter } from "next/router";
import { Button, Row, Col, Spinner } from "react-bootstrap";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "bootstrap-daterangepicker/daterangepicker.css";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { useCallback, useEffect, useState, Fragment } from "react";
import moment from "moment";
import { getListPurchase, setUpdateStatusPurchase } from "services/purchase";
import Cookies from "js-cookie";
import { Number } from "components";
import Swal from "sweetalert2";

export default function PurchaseContent() {
  let [selectDateRange, setSelectDateRange] = useState("");
  let [selected, setSelected] = useState([]);
  let [status, setStatus] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  let [data, setData] = useState([]);
  let [daterange, setDaterange] = useState({
    startDate: moment().format("MM/DD/YYYY"),
    endDate: moment().format("MM/DD/YYYY"),
    locale: {
      cancelLabel: "Semua",
    },
  });
  const [purchase, setPurchase] = useState({
    count_status: {
      closed: "",
      confirmed: "",
      sent: "",
      all: "",
    },
    purchase: [],
  });

  const [columns, setColumns] = useState([
    {
      dataField: "id",
      text: "id",
      hidden: true,
    },
    {
      dataField: "ib_idx",
      text: "ib_idx",
      hidden: true,
    },
    {
      dataField: "pur_status",
      text: "Status",
      formatter: StatusStyle,
      sort: true,
    },
    {
      dataField: "pur_date_purchase",
      text: "Tgl. Pembelian",
      formatter: DateFormater,
      sort: true,
    },
    {
      dataField: "pur_date_delivery",
      text: "Tgl. Estimasi Pengiriman",
      formatter: DateFormater,
      sort: true,
    },
    {
      dataField: "ac_name",
      text: "Akun",
      formatter: AccountStyle,
      sort: true,
    },
    {
      dataField: "total_cost",
      text: "Jumlah",
      formatter: priceFormatter,
      sort: true,
    },
    {
      dataField: "user_fullname",
      text: "Pengguna",
      sort: true,
    },
  ]);

  const router = useRouter();

  const getListPurcahseAPI = useCallback(
    async (token, branch, status, selectDateRange) => {
      setIsLoading(true);
      const result = await getListPurchase(
        token,
        branch,
        status,
        selectDateRange
      );
      setIsLoading(false);
      setPurchase(result?.data.data);
    },
    []
  );

  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  useEffect(() => {
    getListPurcahseAPI(token, branch, status, selectDateRange);
  }, []);

  const defaultSorted = [
    {
      dataField: "id",
      order: "desc",
    },
  ];

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      router.push(`/team/purchase/detail/${row.pur_idx}`);
    },
  };

  const { SearchBar } = Search;
  const optionPagination = {
    paginationSize: 4,
    showTotal: true,
  };

  function priceFormatter(cell, row) {
    return (
      <span>
        <Number value={cell} />
      </span>
    );
  }

  function StatusStyle(cell, row) {
    if (cell === "Sent") {
      return <span className="badge bg-secondary">{cell}</span>;
    } else if (cell === "Confirmed") {
      return <span className="badge bg-warning">{cell}</span>;
    } else if (cell === "Receiving") {
      return <span className="badge bg-success">{cell}</span>;
    } else {
      return <span className="badge bg-danger">{cell}</span>;
    }
  }

  function AccountStyle(cell, row) {
    if (cell === null) {
      return "-";
    } else {
      return cell;
    }
  }

  function DateFormater(cell, row) {
    const formatDate = moment(cell).format("DD-MM-YYYY");

    return formatDate;
  }

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    onSelect: (rows, isSelect, rowIndex, e) => {
      if (isSelect === true) {
        setSelected([...selected, rows]);
      } else {
        const newSelected = selected.filter(function (f) {
          return f !== rows;
        });
        setSelected(newSelected);
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      if (isSelect === true) {
        setSelected(rows);
      } else {
        selected = [];
        setSelected(selected);
      }
    },
  };

  const onSortPurchase = (value) => {
    status = value;
    getListPurcahseAPI(token, branch, status, selectDateRange);
  };

  const onSortPurchaseByDaterange = (value) => {
    selectDateRange = value;
    status = "";
    getListPurcahseAPI(token, branch, status, selectDateRange);
  };

  const allDate = (event, picker) => {
    selectDateRange = event.target.value;
    getListPurcahseAPI(token, branch, status, selectDateRange);
  };

  let pur_idx = [];
  const onUpdateOrderConfirmed = (value) => {
    const titleText = value === "Confirmed" ? `${selected.length} Pesanan Dikonfirmasi ?` : `${selected.length} Menerima Pesanan ?`
    selected.map((m) => {
      pur_idx.push({
        id: m.pur_idx,
        status: value,
      });
    });

    const formData = {
      pur_idx,
      token,
    };


    Swal.fire({
      text: titleText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await setUpdateStatusPurchase(formData, token);
        if (response.error) {
          Swal.fire(response.message, "", "error");
        } else {
          Swal.fire(response.data.data.message, "", "success");
          getListPurcahseAPI(token, branch, status, selectDateRange);
          setSelected([]);
        }
      }
    });
  };

  return (
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
                      Daftar Pesanan Pembelian
                    </h4>
                  </div>
                </div>
                <div className="col-md-4">
                  <Button
                    variant="primary"
                    className="float-right"
                    onClick={() => router.push("/team/purchase/add")}
                  >
                    <i className="fa fa-plus"></i>
                    Tambah Pesanan Pembelian
                  </Button>
                </div>
              </Row>
              <Row>
                <Col md={2}>
                  <Button
                    variant="default"
                    className="border w-100"
                    onClick={() => onSortPurchase("")}
                  >
                    All ({purchase.count_status.all})
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="default"
                    className="border w-100"
                    onClick={() => onSortPurchase("Sent")}
                  >
                    Pesanan Terkirim ({purchase.count_status.sent})
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="default"
                    className="border w-100"
                    onClick={() => onSortPurchase("Confirmed")}
                  >
                    Pesanan Dikonfirmasi ({purchase.count_status.confirmed})
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="default"
                    className="border w-100"
                    onClick={() => onSortPurchase("Closed")}
                  >
                    Menerima Pesanan ({purchase.count_status.receiving})
                  </Button>
                </Col>
              </Row>
              <Col
                md={12}
                className="justify-content-between border-bottom p-2 mb-2"
              ></Col>
              <Row>
                <Col md={3}>
                  <DateRangePicker
                    initialSettings={daterange}
                    value={daterange}
                    onApply={(event) =>
                      onSortPurchaseByDaterange(event.target.value)
                    }
                    onCancel={allDate}
                  >
                    <input type="text" className="form-control text-center" />
                  </DateRangePicker>
                </Col>
                <Col md={3} className="d-flex justify-content-between">
                  <Button
                    variant="default"
                    onClick={() => onUpdateOrderConfirmed("Confirmed")}
                    disabled={selected.length !== 0 ? false : true}
                  >
                    <strong
                      className={
                        selected.length > 0 ? "text-warning" : "text-secondary"
                      }
                    >
                      Pesanan Dikonfirmasi
                    </strong>
                  </Button>
                </Col>
                <Col md={3} className="d-flex justify-content-between">
                  <Button
                    variant="default"
                    onClick={() => onUpdateOrderConfirmed("Receiving")}
                    disabled={selected.length !== 0 ? false : true}
                  >
                    <strong
                      className={
                        selected.length > 0 ? "text-success" : "text-secondary"
                      }
                    >
                      Menerima Pesanan
                    </strong>
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ToolkitProvider
                    bootstrap4
                    keyField="id"
                    data={purchase.purchase}
                    columns={columns}
                    defaultSorted={defaultSorted}
                    search
                  >
                    {(props) => (
                      <Fragment>
                        <Row>
                          <Col md={12}>
                            <div className="float-right">
                              <SearchBar
                                {...props.searchProps}
                                placeholder="Cari..."
                              />
                            </div>
                          </Col>
                        </Row>
                        {isLoading ? (
                          <div className="text-center">
                            <Spinner
                              as="span"
                              animation="border"
                              size="md"
                              role="status"
                              aria-hidden="true"
                            />
                          </div>
                        ) : (
                          <div style={{ cursor: "pointer" }}>
                            <BootstrapTable
                              {...props.baseProps}
                              pagination={paginationFactory(optionPagination)}
                              loading={true}
                              bordered={false}
                              selectRow={selectRow}
                              rowEvents={rowEvents}
                            />
                          </div>
                        )}
                      </Fragment>
                    )}
                  </ToolkitProvider>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
}
