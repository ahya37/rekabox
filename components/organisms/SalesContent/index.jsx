import "bootstrap-daterangepicker/daterangepicker.css";
import { Number } from "components";
import Cookies from "js-cookie";
import moment from "moment";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { getListSales, setSaveAllStockOutSales } from "services/sales";
import Swal from "sweetalert2";

export default function SalesContent() {
  const [selectDateRange, setSelectDateRange] = useState("");
  const [selected, setSelected] = useState([]);
  const [itemStockMinus, setItemStockMinus] = useState([]);
  const [notifStockMinus, setNotifStockMinus] = useState("");
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [daterange, setDaterange] = useState({
    startDate: moment().format("MM/DD/YYYY"),
    endDate: moment().format("MM/DD/YYYY"),
    locale: {
      cancelLabel: "Semua",
    },
  });
  const [sales, setSales] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const columns = [
    {
      dataField: "id",
      text: "id",
      hidden: true,
    },
    {
      dataField: "sal_status",
      text: "Status",
      formatter: StatusStyle,
      sort: true,
    },
    {
      dataField: "sal_date_sales",
      text: "Tgl. Penjualan",
      formatter: DateFormater,
      sort: true,
    },
    {
      dataField: "sal_estimated_date_stockout",
      text: "Tgl. Estimasi Stok Keluar",
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
      dataField: "sal_name",
      text: "Item",
      sort: true,
    },
    {
      dataField: "total_price",
      text: "Jumlah",
      formatter: priceFormatter,
      sort: true,
    },
    {
      dataField: "user_fullname",
      text: "Pengguna",
      sort: true,
    },
  ];

  const router = useRouter();

  const getListSalesAPI = useCallback(
    async (token, branch, status, selectDateRange) => {
      setIsLoading(true);
      const result = await getListSales(
        token,
        branch,
        status,
        selectDateRange
      );
      setIsLoading(false);
      setSales(result?.data.data.sales);
    },
    []
    );
    
  const disabledDataSelectRow = [];
  for(let i = 0; i < sales.length; i++){
    if (sales[i].sal_status === 'Released') {
      disabledDataSelectRow = disabledDataSelectRow.concat(sales[i].id);
    }
  }

  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  useEffect(() => {
    getListSalesAPI(token, branch, status, selectDateRange);
  }, []);

  const defaultSorted = [
    {
      dataField: "id",
      order: "desc",
    },
  ];

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      router.push(`/team/sales/${row.sal_idx}`);
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
    if (cell === "In Transit") {
      return <span className="badge bg-warning">{cell}</span>;
    } else {
      return <span className="badge bg-success">{cell}</span>;
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
    nonSelectable:disabledDataSelectRow,
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
    getListSalesAPI(token, branch, status, selectDateRange);
  };

  const onSortPurchaseByDaterange = (value) => {
    selectDateRange = value;
    status = "";
    getListSalesAPI(token, branch, status, selectDateRange);
  };

  const allDate = (event, picker) => {
    selectDateRange = event.target.value;
    getListSalesAPI(token, branch, status, selectDateRange);
  };

  let sal_idx = [];
  const onUpdateStockOut = async () => {
    selected.map((m) => {
      sal_idx.push({
        id: m.sal_idx,
      });
    });


    const { value: note } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Keluarkan semua stok yang terpilih',
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
          Swal.fire(response?.data.data.message, "", "success");
          getListSalesAPI(token, branch, status, selectDateRange);
          setSelected([]);
        }
      }
    }

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
                      Daftar Penjualan
                    </h4>
                  </div>
                </div>
                <div className="col-md-4">
                  <Button
                    variant="primary"
                    className="float-right"
                    onClick={() => router.push("/team/sales/add")}
                  >
                    <i className="fa fa-plus"></i>
                    Tambah Pesanan Penjualan
                  </Button>
                </div>
              </Row>
              <Row>
                <Col md={1}>
                  <Button
                    variant="default"
                    className="border-0"
                    onClick={() => onSortPurchase("")}
                  >
                    All
                  </Button>
                </Col>
                <Col md={2}>
                  <Button
                    variant="default"
                    className="border-0"
                    onClick={() => onSortPurchase("In Transit")}
                  >
                    In Transit
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="default"
                    className="border-0"
                    onClick={() => onSortPurchase("Released")}
                  >
                    Rilis
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


              </Row>
              {selected.length === 0 ? (
                ''
              ) : (
                <Row>
                  <Col md={12} className="mt-4">
                    <div className="alert bg-info">
                      <span className="mt-1">{selected.length} item terpilih</span>
                      <Button className="ml-3" variant="secondary" onClick={() => onUpdateStockOut('Out')}>Stok Keluar</Button>
                    </div>
                  </Col>
                </Row>

              )}
              <Row>
                <Col md={12}>
                  <ToolkitProvider
                    bootstrap4
                    keyField="id"
                    data={sales}
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
                            <ul className="text-danger">
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
      </Row>
    </div>
  );
}
