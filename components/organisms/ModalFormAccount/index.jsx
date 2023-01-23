import { Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setListAccount, setShowFormAccount } from "redux/action/account";
import styles from "../../../styles/Fileupload.module.css";
import Cookies from "js-cookie";
import { getListAccountCustomerOnly, getListAccountOwnerOnly, setSaveAccount } from "services/account";

export default function ModalFormAccount({type}) {
    const { showFormAccount } = useSelector((state) => state.accountReducer);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const token = Cookies.get("token");
    const branch = Cookies.get("branch");

    const handleClose = () => {
        dispatch(setShowFormAccount(false))
    };

    const getListAccountAPI = useCallback(async (token, branch, type) => {
        if (type === 'Suplier') {
            const response = await getListAccountOwnerOnly(token, branch);
            dispatch(setListAccount(response?.data.data.accounts));
        }else{
            const response = await getListAccountCustomerOnly(token, branch);
            dispatch(setListAccount(response?.data.data.accounts));
        }
    });

    useEffect(() => {
        getListAccountAPI(token, branch, type);
    }, []);

    const onSave = useCallback(async (values) => {
        const token = Cookies.get("token");
        const branch = Cookies.get("branch");

        if (!values.name) {
            toast.error("Silahkan isi nama akun !");
        } else {
            const formData = new FormData();
            formData.append("type", type);
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
                toast.success(response.data.meta.message);
                if (type === 'Suplier') {
                    const response = await getListAccountOwnerOnly(token, branch);
                    dispatch(setListAccount(response?.data.data.accounts));
                }else{
                    const response = await getListAccountCustomerOnly(token, branch);
                    dispatch(setListAccount(response?.data.data.accounts));
                }
                dispatch(setShowFormAccount(false))
                
                
            }
        }
    }, []);


    return (
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

                    <Modal show={showFormAccount} onHide={handleClose} animation={false} centered size="lg">
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
    )
}
