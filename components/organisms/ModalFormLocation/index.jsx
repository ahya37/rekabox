import { Formik } from "formik";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setListLocation, setShowFormLocation } from "redux/action/location";
import { setSaveLocation } from "services/location";
import { getListLocationItem } from "services/locationitem";

export default function ModalFormLocation({ type }) {
    const { showFormLocation } = useSelector((state) => state.locationReducer);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const token = Cookies.get("token");
    const branch = Cookies.get("branch");

    const handleClose = () => {
        dispatch(setShowFormLocation(false))
    };

    const getLocationPI = useCallback(async (token, branch) => {
        const resultLocations = await getListLocationItem(token, branch);
        dispatch(setListLocation(resultLocations?.data.data.location));
    });

    useEffect(() => {
        getLocationPI(token, branch);
    }, []);

    const onSave = useCallback(async (values) => {
        if (!values.name) {
            toast.error("Silahkan isi nama lokasi !");
        } else {
            const data = new FormData();
            data.append("loc_name", values.name);
            data.append("loc_desc", values.note);
            data.append("br_idx", branch);
            data.append("token", token);
            
            setIsLoading(true);
            const response = await setSaveLocation(data, token);
            setIsLoading(false);
            if (response.error) {
                toast.error(response.message);
            } else {
                toast.success(response.data.meta.message);
                getLocationPI(token, branch);
                dispatch(setShowFormLocation(false))

            }
        }
    }, []);


    return (
        <Formik
            initialValues={{
                name: "",
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

                    <Modal show={showFormLocation} onHide={handleClose} animation={false} centered size="lg">
                        <Modal.Header>
                            <Modal.Title>Tambah Lokasi</Modal.Title>
                            <Button variant="default" onClick={handleClose}>
                                <i className="fa fa-close"></i>
                            </Button>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="validationDefaultUsername">Nama</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nama Lokasi"
                                            name="name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="validationDefault05">Deskripsi</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        placeholder="Deskripsi Lokasi"
                                        name="note"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.note}
                                    ></textarea>
                                </div>
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
