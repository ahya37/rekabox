import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Button, Col, Row, Modal, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import { Formik, Field } from "formik";
import styles from "../../../styles/Fileupload.module.css";
import { toast } from "react-toastify";
import { setSaveAccount } from "services/account";
import Cookies from "js-cookie";

export default function AccountContent() {
  const [selectDateRange, setSelectDateRange] = useState(null);
  const [show, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [daterange, setDaterange] = useState({
    startDate: moment().format("MM/DD/YYYY"),
    endDate: moment().format("MM/DD/YYYY"),
    locale: {
      cancelLabel: "Semua",
    },
  });
  const [name, setName] = useState("");
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const router = useRouter();

  const products = [];
  const clearDate = (event, picker) => {
    const d = picker.element.val("Semua");
    setSelectDateRange("");
  };

  const dateExportDefault = daterange.startDate + "-" + daterange.endDate;

  const defaultSorted = [
    {
      dataField: "name",
      order: "asc",
    },
  ];

  const columns = [
    {
      dataField: "type",
      text: "Type",
    },
    {
      dataField: "name",
      text: "Nama",
    },
    {
      dataField: "telp",
      text: "Telepon",
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      dataField: "address",
      text: "Alamat",
    },
    {
      dataField: "note",
      text: "Note",
    },
  ];

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
  };

  const onSave = useCallback(async (values) => {
    if (!values.name) {
      toast.error("Silahkan isi nama akun !");
    } else {
      const token = Cookies.get("token");
      const branch = Cookies.get("branch");
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
        router.push("/team/account");
      }
    }
  }, []);

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
              <Row>
                <Col md={6}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari nama item ..."
                  />
                </Col>
                <Col md={3} className="d-flex justify-content-between">
                  <Button
                    variant="outline-danger"
                    onClick={() => router.push("/team/bundle/add")}
                    disabled={true}
                  >
                    <strong>Hapus</strong>
                  </Button>
                </Col>
              </Row>
              <div className="mb-4"></div>
              <Row>
                <Col md={12}>
                  <BootstrapTable
                    keyField="id"
                    data={products}
                    columns={columns}
                    selectRow={selectRow}
                    loading={true}
                    bordered={false}
                    defaultSorted={defaultSorted}
                  />
                </Col>
              </Row>
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
          isSubmitting,
          resetForm,
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
                      <Field type="radio" name="type" value="Vendor" /> Vendor
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
    </div>
  );
}
