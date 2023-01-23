import { Formik } from "formik";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { setSaveLocation } from "services/location";
import { getListLocationItem } from "../../../services/locationitem";
import styles from "../../../styles/Fileupload.module.css";

export default function FormOptionLocation(props) {
  const { placeholderText } = props;
  const [location, setLocation] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  const getListLocationAPI = useCallback(
    async (token, branch) => {
      const response = await getListLocationItem(token, branch);
      const dataLocation = response.data.data.location;
      setLocation(dataLocation);
    },
    [getListLocationItem]
  );

  const token = Cookies.get("token");
  const branch = Cookies.get("branch");

  useEffect(() => {
    getListLocationAPI(token, branch);
  }, []);

  const optionLocations = location.map((d) => ({
    value: d.loc_idx,
    label: d.loc_name,
  }));

  const handleChange = (e) => {
    if (e === null) {
      dispatch({ type: "SET_SHOW_ITEMS", value: false });
    } else {
      dispatch({ type: "SET_DETAIL_ITEM", value: {} });
      dispatch({ type: "SET_SHOW_ITEMS", value: e });
    }
  };

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
        <i className="fa fa-plus"></i> Tambah Lokasi
      </center>
    )
  }

  const onSave = useCallback(async (values) => {
    if (!values.name) {
      toast.error("Silahkan isi nama lokasi")
    } else {
      
      const data = new FormData();
      data.append("loc_name", values.name);
      data.append("loc_desc", values.desc);
      data.append("br_idx", branch);
      data.append("token", token);

      setIsLoading(true);
      const response = await setSaveLocation(data, token);
      setIsLoading(false);
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success("Lokasi Berhasil Disimpan");
        getListLocationAPI(token, branch);
        handleClose();
      }
    }
  })

  return (
    <>
      <Select
        components={{
          MenuList,
          MenuListFooter: (
            <MenuListFooter onClick={handleShow} />
          )
        }}
        placeholder={placeholderText}
        options={optionLocations}
        onChange={handleChange}
        isClearable={true}
        instanceId
      />
      <Formik
        initialValues={{
          name: "",
          desc: "",
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
                <Modal.Title>Tambah Lokasi</Modal.Title>
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
                  <label>Deskripsi</label>
                  <textarea
                    className="form-control"
                    placeholder="Deskripsi"
                    name="desc"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.desc}
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
    </>
  );
}
