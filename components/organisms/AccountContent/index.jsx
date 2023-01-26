import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Button, Col, Row, Modal, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Formik, Field } from "formik";
import styles from "../../../styles/Fileupload.module.css";
import { toast } from "react-toastify";
import { setSaveAccount, getListAccount, setDeleteAccount, setUpdateAccount } from "services/account";
import Cookies from "js-cookie";
import { useEffect } from "react";
import Swal from "sweetalert2";


export default function AccountContent() {
  const [show, setShowModal] = useState(false);
  const [showEdit, setShowModalEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState([]);
  const [editAccount, setEditAccount] = useState({
    ac_idx: "",
    ac_type: "",
    ac_name: "",
    ac_telp: "",
    ac_email: "",
    ac_address: "",
    ac_note: "",
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleCloseEdit = () => setShowModalEdit(false);
  const handleShowEdit = () => setShowModalEdit(true);

  const router = useRouter();
  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  const getAccountAPI = useCallback(async (token, branch) => {
    setIsLoading(true);
    const resultAccount = await getListAccount(token, branch);
    setIsLoading(false);
    setAccount(resultAccount?.data.data.accounts);
  })

  useEffect(() => {
    getAccountAPI(token, branch);
  }, []);

  const { SearchBar } = Search;
  const optionPagination = {
    paginationSize: 4,
    showTotal: true,
  };

  const defaultSorted = [
    {
      dataField: "ac_name",
      order: "asc",
    },
  ];

  const onDelete = (value) => {

    const data = new FormData();
    data.append('ac_idx', value.ac_idx);
    data.append('token', token);
    Swal.fire({
      text: `Hapus Akun ${value.ac_name} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await setDeleteAccount(data, token)
        if (response.error) {
          Swal.fire(response.message, "", "error");
        } else {
          Swal.fire("Terhapus", "", "success");
          getAccountAPI(token, branch);
          router.push("/team/account");
        }

      }

    });
  }

  const [columns, setColumns] = useState([
    {
      dataField: "ac_type",
      text: "Type",
      sort: true

    },
    {
      dataField: "ac_name",
      text: "Nama",
      sort: true

    },
    {
      dataField: "ac_telp",
      text: "Telepon",
      sort: true

    },
    {
      dataField: "ac_email",
      text: "Email",
      sort: true

    },
    {
      dataField: "ac_address",
      text: "Alamat",
      sort: true

    },
    {
      dataField: "ac_note",
      text: "Note",
      sort: true
    },
    {
      dataField: "Pilihan",
      text: "Pilihan",
      formatter: (e, row, rowIndex) => {
        return (
          <>
            <Button
              variant="default"
              className="btn btn-sm"
              onClick={() => onDelete(row)}
            >
              <i className="fa fa-trash" aria-hidden="true" title="Hapus"></i>
            </Button>
            <Button
              variant="default"
              className="btn btn-sm"
              onClick={() => onShowFormUpdate(row)}
            >
              <i className="fa fa-edit" aria-hidden="true" title="Edit"></i>
            </Button>
          </>
        )
      },
      sort: true
    },
  ])


  const onSave = useCallback(async (values) => {
    if (!values.name) {
      toast.error("Nama akun tidak boleh kosong!");
    } else {

      const formData = new FormData();
      formData.append("type", values.type);
      formData.append("name", values.name);
      formData.append("telp", values.telp);
      formData.append("email", values.email);
      formData.append("address", values.address);
      formData.append("note", values.note);
      formData.append("branch", branch);
      formData.append("token", token);
      setIsLoading(true);
      const response = await setSaveAccount(formData, token);
      setIsLoading(false);
      if (response.error) {
        toast.error(response.message);
      } else {
        setShowModal(false);
        toast.success(response.data.meta.message);
        getAccountAPI(token, branch);
        router.push("/team/account");
      }
    }
  }, []);

  const onShowFormUpdate = (value) => {
    setEditAccount(value);
    handleShowEdit();

  }

  const onUpdate = async () => {
    if (!editAccount.ac_name) {
      toast.error("Nama akun tidak boleh kosong!");
    } else {

      const formData = new FormData();
      formData.append("idx", editAccount.ac_idx);
      formData.append("name", editAccount.ac_name);
      formData.append("telp", editAccount.ac_telp ?? '');
      formData.append("email", editAccount.ac_email ?? '');
      formData.append("address", editAccount.ac_address ?? '');
      formData.append("note", editAccount.ac_note ?? '');
      formData.append("branch", branch);
      formData.append("token", token);
      setIsLoading(true);
      const response = await setUpdateAccount(formData, token);
      setIsLoading(false);
      if (response.error) {
        toast.error(response.message);
      } else {
        setShowModal(false);
        toast.success(response.data.meta.message);
        handleCloseEdit();
        getAccountAPI(token, branch);
        router.push("/team/account");
      }
    }
  }

  return (
    <div className="container-fluid">
      <Row>
        <div className="col-md-12">
          <div className="iq-card">
            <div className="iq-card-body">
              <Row>
                <div className="col-md-8">
                  <div className="iq-header-title">
                    <span>Data Center</span>
                    <h4 className="card-title text-primary">Akun</h4>
                  </div>
                </div>
                <div className="col-md-4">
                  <Button
                    variant="primary"
                    className="float-right"
                    onClick={handleShow}
                  >
                    <i className="fa fa-plus"></i>
                    Tambah Akun
                  </Button>
                </div>
              </Row>

              <Col
                md={12}
                className="justify-content-between border-bottom p-2 mb-2"
              ></Col>
              {isLoading ? (
                <div className="col-md-12 mt-4 d-flex justify-content-center">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <ToolkitProvider
                  bootstrap4
                  keyField="ac_idx"
                  data={account}
                  columns={columns}
                  defaultSorted={defaultSorted}
                  search
                >
                  {(props) => (
                    <>
                      <Row>
                        <Col md={4}>
                          <SearchBar
                            {...props.searchProps}
                            placeholder="Cari"
                          />
                        </Col>
                      </Row>
                      <div className="mb-4"></div>
                      <Row>
                        <Col md={12}>
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory(optionPagination)}
                            loading={true}
                            bordered={false}
                          />
                        </Col>
                      </Row>

                    </>
                  )}
                </ToolkitProvider>
              )}
            </div>
          </div>
        </div>
      </Row>
      <Formik
        initialValues={{
          type: "",
          name: "",
          telp: "",
          email: "",
          address: "",
          note: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          onSave(values);
          resetForm();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <>
            <Modal show={show} onHide={handleClose} animation={false} centered>
              <Modal.Header>
                <Modal.Title>Tambah Akun</Modal.Title>
                <Button variant="default" onClick={handleClose}>
                  <i className="fa fa-close"></i>
                </Button>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <div className="custom-control-inline">
                    <label>
                      <Field type="radio" name="type" value="Suplier" /> Suplier
                    </label>
                  </div>
                  <div className="custom-control-inline">
                    <label>
                      <Field type="radio" name="type" value="Customer" /> Customer
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Nama
                    <sup className={styles["text-required"]}>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nama Akun"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                </div>
                <div className="form-group">
                  <Row>
                    <Col md={6}>
                      <label>Telepon</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nomor Telepon"
                        name="telp"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.telp}
                      />
                    </Col>
                    <Col md={6}>
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                      {errors.email && touched.email && errors.email}
                    </Col>
                  </Row>
                </div>
                <div className="form-group">
                  <label>Alamat</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Alamat"
                    name="address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                  />
                </div>
                <div className="form-group">
                  <label>Note</label>
                  <textarea
                    className="form-control"
                    placeholder="Note"
                    name="note"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.note}
                  ></textarea>
                </div>
              </Modal.Body>
              <Modal.Footer>
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
                  <Button
                    type="submit"
                    className="btn btn-primary mt-3"
                    onClick={() => handleSubmit()}
                  >
                    Simpan
                  </Button>
                )}
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Formik>
      <Modal show={showEdit} onHide={handleCloseEdit} animation={false} centered>
        <Modal.Header>
          <Modal.Title>Edit Akun</Modal.Title>
          <Button variant="default" onClick={handleCloseEdit}>
            <i className="fa fa-close"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>
              Nama
              <sup className={styles["text-required"]}>*</sup>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Nama Akun"
              name="name"
              onChange={(e) => setEditAccount({
                ...editAccount,
                ac_name: e.target.value
              })}
              value={editAccount.ac_name}
            />
          </div>
          <div className="form-group">
            <Row>
              <Col md={6}>
                <label>Telepon</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nomor Telepon"
                  name="telp"
                  onChange={(e) => setEditAccount({
                    ...editAccount,
                    ac_telp: e.target.value
                  })}
                  value={editAccount.ac_telp}
                />
              </Col>
              <Col md={6}>
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  onChange={(e) => setEditAccount({
                    ...editAccount,
                    ac_email: e.target.value
                  })}
                  value={editAccount.ac_email}
                />
              </Col>
            </Row>
          </div>
          <div className="form-group">
            <label>Alamat</label>
            <input
              type="text"
              className="form-control"
              placeholder="Alamat"
              name="address"
              onChange={(e) => setEditAccount({
                ...editAccount,
                ac_address: e.target.value
              })}
              value={editAccount.ac_address}
            />
          </div>
          <div className="form-group">
            <label>Note</label>
            <textarea
              className="form-control"
              placeholder="Note"
              name="note"
              onChange={(e) => setEditAccount({
                ...editAccount,
                ac_note: e.target.value
              })}
              value={editAccount.ac_note}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
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
            <Button
              type="submit"
              className="btn btn-primary mt-3"
              onClick={onUpdate}
            >
              Edit
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
