import { Number } from "components";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { getListBundle, setDeleteBundle } from "services/purchase";
import Swal from "sweetalert2";

export default function BundleContent() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  const getListBundleAPI = useCallback(async (token, branch) => {
    setIsLoading(true);
    const result = await getListBundle(token, branch);
    setIsLoading(false);
    setData(result?.data.data.bundles);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    getListBundleAPI(token, branch);
  }, []);

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

  const defaultSorted = [
    {
      dataField: "ib_name",
      order: "asc",
    },
  ];

  const columns = [
    {
      dataField: "ib_idx",
      text: "ID",
      hidden: true,
    },
    {
      dataField: "ib_name",
      text: "Nama Bundel",
      sort: true,
    },
    {
      dataField: "ib_cost",
      text: "Biaya",
      sort: true,
      formatter: priceFormatter,
    },
    {
      dataField: "ib_price",
      text: "Harga",
      sort: true,
      formatter: priceFormatter,
    },
    {
      dataField: "ib_create",
      text: "Tanggal",
      sort: true,
    },
  ];

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

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      router.push(`/team/bundle/${row.ib_idx}`);
    },
  };

  let list_ib_idx = [];
  const onDelete = () => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    selected.map((m) => {
      list_ib_idx.push({
        ib_idx: m.ib_idx,
      });
    });

    const formData = {
      list_ib_idx,
      token,
    };

    Swal.fire({
      text: `Hapus Bundel?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await setDeleteBundle(formData, token);
        if (response.error) {
          Swal.fire(response.message, "", "error");
        } else {
          Swal.fire("Terhapus", "", "success");
          const result = await getListBundle(token, branch);
          setData(result?.data.data.bundles);
          setSelected([]);
          router.push("/team/bundle");
        }
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="card-body">
          <span>Pembelian & Penjualan</span>
          <h4 className="card-title text-primary">Bundel</h4>
          <div className="border-bottom mb-4"></div>
          <Row>
            <Col md={6}></Col>
            <Col md={6}>
              <Button
                variant="primary"
                className="float-right mb-4"
                onClick={() => router.push("/team/bundle/add")}
              >
                <i className="fa fa-plus"></i>
                Tambah
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <ToolkitProvider
                bootstrap4
                keyField="ib_idx"
                data={data}
                columns={columns}
                defaultSorted={defaultSorted}
                search
              >
                {(props) => (
                  <Fragment>
                    <Row>
                      <Col md={2}>
                        {selected.length !== 0 ? (
                          <Button variant="outline-danger" onClick={onDelete}>
                            Hapus
                          </Button>
                        ) : (
                          ""
                        )}
                      </Col>
                      <Col md={10}>
                        <div className="float-right">
                          <SearchBar
                            {...props.searchProps}
                            placeholder="Cari"
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
  );
}
