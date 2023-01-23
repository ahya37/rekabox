import { Formik } from "formik";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { setSelectedAccount } from "redux/action/account";
import { getListAccountOwnerOnly, setSaveAccount } from "services/account";
import styles from "../../../styles/Fileupload.module.css";

export default function FormSelectAccount() {
    const [account, setAccount] = useState([]);
    const [selectAccount, setSelectAccount] = useState("");
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getListAccountAPI = useCallback(async (token, branch) => {
        const response = await getListAccountOwnerOnly(token, branch);
        setAccount(response?.data.data.accounts);
    });

    const token = Cookies.get("token");
    const branch = Cookies.get("branch");

    useEffect(() => {
        getListAccountAPI(token, branch);
    }, []);

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

    dispatch(setSelectedAccount({selectAccount}))
    
    return (
        <>
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
                onChange={setSelectAccount.bind(this)}
                instanceId
            />
            <i className="fa fa-sort text-white float-right mt-2"></i>
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
        </>
    )
}
