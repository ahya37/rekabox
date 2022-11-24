import { Formik } from "formik";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { setDetailItem } from "redux/action/item";
import { getListAccountOwnerOnly, setSaveAccount } from "services/account";
import { getItemByLocation } from "../../../services/item";
import styles from "../../../styles/Fileupload.module.css";
import {
  FormOptionLocation,
  StockForm,
  StockFormItem
} from "../../molecules";

export default function StockInContent(props) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState([]);
  const [selectAccount, setSelectAccount] = useState("");
  const [show, setShow] = useState(false);

  const { showItems } = useSelector(
    (state) => state.itemReducer
  );

  const [inStock, setInStock] = useState("");
  const router = useRouter();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const dispatch = useDispatch();

  const getItemApi = useCallback(async (locIdx, data, token, branch) => {
    setIsLoading(true);
    const response = await getItemByLocation(locIdx, data, token, branch);
    setIsLoading(false);
    setItems(response.data.data.item);
  }, []);

  const getListAccountAPI = useCallback(async (token, branch) => {
    const response = await getListAccountOwnerOnly(token, branch);
    setAccount(response?.data.data.accounts);
  });

  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  useEffect(() => {
    const locIdx = showItems.value;
    const data = new FormData();
    data.append("token", token);

    setInStock("in");

    if (showItems !== false) {
      getItemApi(locIdx, data, token, branch);
    } else {
      dispatch(setDetailItem([]));
      setItems([]);
    }

    getListAccountAPI(token, branch);
  }, [setItems, showItems]);

  const optionsAccount = account.map((d) => ({
    value: d.ac_idx,
    label: d.ac_name,
  }));

  const MenuList = (props) => {
    const {
      MenuListFooter = null
    } = props.selectProps.components;

    return (
      <components.MenuList {...props}>
        {props.children}
        {props.children.length && MenuListFooter}
      </components.MenuList>
    )
  }

  const MenuListFooter = ({ onClick }) => {
    return (
      <center onClick={onClick} className="border-top text-primary" style={{ cursor: "pointer" }}>
        <i className="fa fa-plus"></i> Tambah Akun
      </center>
    )
  }

  const onSave = useCallback(async (values) => {
    if (!values.name) {
      toast.error("Silahkan isi nama akun !");
    } else {

      const formData = new FormData();
      formData.append("type", 'Suplier');
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
        setShow(false);
        toast.success(response.data.meta.message);
        getListAccountAPI(token, branch);
        router.push("/team/stockin");
      }
    }
  }, []);

  const handleChangeAccount = (e) => {
    setSelectAccount(e)
  }

  return (
    <div className="container-fluid ">
      <div className="iq-card">
        <div className="card-body">
          <Row className="border-bottom">
            <Col md={8}><h4 className="text-primary">Stok Masuk</h4></Col>
            <Col md={4}>
              
            </Col>
            <Col md={3} className="p-2">
              <FormOptionLocation placeholderText="Pilih lokasi" />
            </Col>
            <Col md={3}></Col>
            <Col md={6}>
              <Button variant="default" className="border float-right">
                Upload Excel
              </Button>
            </Col>
            <Col md={3} className="p-2">
              <Select
                components={{
                  MenuList,
                  MenuListFooter: (
                    <MenuListFooter onClick={handleShow} />
                  )
                }}
                options={optionsAccount}
                placeholder={"Akun"}
                isClearable={true}
                onChange={handleChangeAccount}
                instanceId
              />
            </Col>
           
          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 mt-4">
              <label htmlFor="validationDefault04">
                <h5>Stok Tersimpan</h5>
              </label>
              {isLoading ? (
                <Col className="d-flex justify-content-center">
                  <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                </Col>
              ) : (
                items.length === 0 ? (
                  <p className="d-flex justify-content-center">Pilih lokasi terlebih dahulu</p>
                ) : (
                  <StockForm item={items} />
                )
              )}

            </Col>
            <StockFormItem
              instock={inStock}
              title="Stok Masuk"
              countDesc="Stok Masuk"
              account={selectAccount}
              brlocIdx=""
              brMode=""
            />
          </Row>
        </div>
      </div>

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
            <Modal show={show} onHide={handleClose} animation={false} centered size="lg">
              <Modal.Header>
                <Modal.Title>Tambah Akun</Modal.Title>
                <Button variant="default" onClick={handleClose}>
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
