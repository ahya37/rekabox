import { useRouter } from "next/dist/client/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Container, Modal } from "react-bootstrap";
import { getListBusiness, setSaveBusiness } from "../../../services/business";
import { setSaveUserMemberInfo } from "../../../services/business";
import { toast } from "react-toastify";
import Select, { components } from "react-select";
import styles from "../../../styles/Radiocard.module.css";
import Image from "next/image";
import { Formik } from "formik";

export default function SignUpInfo() {
  const [business, setBusiness] = useState([]);
  const [selectBusiness, setSelectBusiness] = useState(null);
  const [experience, setExperience] = useState(null);
  const [userProfile, setUserProfile] = useState({
    user: {
      user_email: "",
    },
  });
  const [mode, setMode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);


  const handleClose = () => {
    setShow(false);
  };

  const onSelectedMode = (value) => {
    setMode(value);
  };

  const getApiBusiness = useCallback(async () => {
    const data = await getListBusiness();

    setBusiness(data.business);
  }, [getListBusiness]);

  useEffect(() => {
    const getLocalUserProfile = localStorage.getItem("userProfile");
    setUserProfile(JSON.parse(getLocalUserProfile));
    localStorage.removeItem("user-form");
    getApiBusiness();
  }, []);

  const optionBusiness = business.map((d) => ({
    value: d.bs_id,
    label: d.bs_name,
  }));

  const optionExperience = [
    { value: "Y", label: "Ya" },
    { value: "T", label: "Tidak" },
  ];

  const handleShow = () => {
    setShow(true);
  };

  const MenuList = (props) => {
    const { MenuListFooter = null } = props.selectProps.components;

    return (
      <components.MenuList {...props}>
        {props.children}
        {props.children.length && MenuListFooter}
      </components.MenuList>
    );
  };

  const MenuListFooter = ({ onClick }) => {
    return (
      <center
        onClick={onClick}
        className="border-top text-primary"
        style={{ cursor: "pointer" }}
      >
        Lainnya
      </center>
    );
  };

  const router = useRouter();
  const onSubmit = async () => {
    const selectedBusiness =
      selectBusiness === null ? null : selectBusiness.value;
    const selectedExperience = experience === null ? null : experience.value;
    const useForm = {
      business,
      selectedBusiness,
      selectedExperience,
      mode,
    };

    const data = new FormData();
    data.append("email", userProfile.user.user_email);
    data.append("bs_id", useForm.selectedBusiness);
    data.append("br_mode", useForm.mode);
    data.append("br_class", "Pusat");
    data.append("inventory_management_experience", useForm.selectedExperience);

    setIsLoading(true);
    const result = await setSaveUserMemberInfo(data);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Berhasil menyimpan");
      router.push("/team/welcome");
    }
  };

  const onSave = useCallback(async (values) => {
    const token = userProfile.access_token;
    const data = new FormData();
    data.append('name', values.name);

    setIsLoading(true);
    const response = await setSaveBusiness(data, token);
    setIsLoading(false);

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response?.data.data.message);
      setShow(false);
      const getLocalUserProfile = localStorage.getItem("userProfile");
      setUserProfile(JSON.parse(getLocalUserProfile));
      localStorage.removeItem("user-form");
      getApiBusiness();
    } 
    
}, []);

  return (
    <Container>
      <div className="content">
        <div className="row justify-content-center">
          <div className="col-md-12 cols-m-12">
            <div className="row justify-content-center">
              <div className="form-block">
                <Row>
                  <Col md={2}></Col>
                  <Col md={10}>
                    <div className="card">
                      <div className="card-body">
                        <div className="ml-4 mb-2 col-md-7">
                          <strong className="ml-2">
                            Beri tahu kami mengenai pengelolaan inventori Anda
                          </strong>
                        </div>
                        <div className="ml-4 col-md-8">
                          <h6 className="ml-2">
                            Apakah sudah pernah mengelola inventori sebelumnya ?
                          </h6>
                          <div className="ml-2 mb-4">
                            <Select
                              options={optionExperience}
                              onChange={setExperience.bind(this)}
                              isClearable={true}
                              instanceId
                            />
                          </div>
                        </div>

                        <div className="ml-4 col-md-8">
                          <h6 className="ml-2">
                            Anda termasuk dalam industri apa ?
                          </h6>
                          <div className="ml-2">
                            <Select
                              components={{
                                MenuList,
                                MenuListFooter: (
                                  <MenuListFooter onClick={handleShow} />
                                ),
                              }}
                              options={optionBusiness}
                              onChange={setSelectBusiness.bind(this)}
                              isClearable={true}
                              instanceId
                            />
                          </div>
                        </div>

                        <div className="ml-4 mt-4">
                          <h6 className="ml-2 col-md-6">
                            Pilih mode yang paling cocok untuk Anda
                          </h6>
                          <div className="ml-3">
                            <div className={styles["card-container"]}>
                              <div className="row">
                                <div className="col-md-4">
                                  <label className="card">
                                    <input
                                      name="plan"
                                      className={styles.radio}
                                      type="radio"
                                      value="Basic"
                                      onChange={(event) =>
                                        onSelectedMode(event.target.value)
                                      }
                                    />
                                    <span className={styles["plan-details"]}>
                                      <span className={styles["plan-type"]}>
                                        Basic
                                      </span>
                                      <span className={styles["plan-cost"]}>
                                        <div className="mt-4">
                                          <Image
                                            src="/ilustrations/basic-mode.svg"
                                            width={50}
                                            height={50}
                                          />
                                        </div>
                                      </span>
                                      <span>
                                        Manajemen inventaris termudah mode yang
                                        sempurna untuk siapa saja.
                                      </span>
                                    </span>
                                  </label>
                                </div>
                                <div className="col-md-4">
                                  <label className="card">
                                    <input
                                      name="plan"
                                      className={styles.radio}
                                      type="radio"
                                      value="Lokasi"
                                      onChange={(event) =>
                                        onSelectedMode(event.target.value)
                                      }
                                    />

                                    <span className={styles["plan-details"]}>
                                      <span className={styles["plan-type"]}>
                                        Lokasi
                                      </span>
                                      <span className={styles["plan-cost"]}>
                                        <div className="mt-4">
                                          <Image
                                            src="/ilustrations/location-mode.svg"
                                            width={50}
                                            height={50}
                                          />
                                        </div>
                                      </span>
                                      <span>
                                        Mode untuk mengelola produk yang sama
                                        tersebar di lokasi yang berbeda.
                                      </span>
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                            {isLoading ? (
                              <Button
                                variant="primary"
                                className="mt-4 btn btn-pill btn-sm text-white"
                                disabled
                              >
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
                                variant="primary"
                                className="mt-4 btn btn-pill btn-sm text-white"
                                onClick={onSubmit}
                              >
                                Buat Inventori
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Formik
        initialValues={{
          name: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "Isikan nama industri!";
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
            <Modal
              show={show}
              onHide={handleClose}
              animation={false}
              centered
              size="md"
            >
              <Modal.Header>
                <Modal.Title>Sebutkan Industri Lainnya</Modal.Title>
                <Button variant="default" onClick={handleClose}>
                  <i className="fa fa-close"></i>
                </Button>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>
                    Industri
                    <sup className={styles["text-required"]}>*</sup>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name && touched.name ? "is-invalid" : null}`}
                    placeholder="Nama Industri"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  {errors.name && touched.name ? <div className="text-danger">{errors.name}</div> : null}
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
    </Container>
  );
}
