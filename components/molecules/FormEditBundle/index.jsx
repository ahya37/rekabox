import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { setSaveCopyBundle, setUpdateBundle } from "services/purchase";
import { generate } from "utils/randomstring";
import { LinkedItem } from "components";
import styles from "../../../styles/Fileupload.module.css";

export default function FormEditBundle(props) {
  const { item, submitStatus } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(item.bundle.ib_idx);
  const [name, setName] = useState(item.bundle.ib_name);
  const [barcode, setBarcode] = useState(item.bundle.ib_barcode);
  const [cost, setCost] = useState(item.bundle.ib_cost);
  const [price, setPrice] = useState(item.bundle.ib_price);
  const [note, setNote] = useState(item.bundle.ib_note);
  const router = useRouter();

  const onCancel = () => {
    router.push("/team/bundle");
  };

  const generateString = () => {
    const randomString = generate(10);
    setBarcode(randomString);
  };

  const onSubmit = async () => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    const form = {
      id,
      name,
      barcode,
      cost,
      price,
      note,
      token,
      branch,
    };

    setIsLoading(true);
    const response =
      submitStatus === "update"
        ? await setUpdateBundle(form, token)
        : await setSaveCopyBundle(form, token);
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
    } else {
      submitStatus === "update"
        ? toast.success("Bundel telah di edit")
        : toast.success("Bundel telah di copy");
      router.push(`/team/bundle/${id}`);
    }
  };

  const onEditListItem = (idx) => {
    router.push(`/team/bundle/edit-relation/${idx}`);
    // GO PAGE EDIT LIST ITEM COPY / NO EDIT-RELATION PAGE
  };

  function ButtonAction() {
    return (
      <Row>
        <Col md={6}>
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
            <>
              {barcode === item.bundle.ib_barcode && submitStatus === "copy" ? (
                <Button
                  type="submit"
                  className="btn btn-primary mt-3"
                  onClick={onSubmit}
                  disabled
                >
                  Simpan
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="btn btn-primary mt-3"
                  onClick={onSubmit}
                >
                  Simpan
                </Button>
              )}
              <Button
                type="reset"
                variant="default"
                className="border ml-2 mt-3"
                onClick={onCancel}
              >
                Batal
              </Button>
            </>
          )}
        </Col>
      </Row>
    );
  }


  return (
    <div className="container-fluid">
      <div className="iq-card">
        <div className="card-body">
          <div className="iq-header-title">
            <span>Pembelian & Penjualan</span>
            <h4 className="card-title text-primary">{submitStatus === 'update' ? 'Edit Bundel' : 'Copy Bundel'}</h4>
          </div>
          <Row className="border-bottom mb-2">
            <Col md={7}>
              <h5>Info</h5>
            </Col>
            <Col md={5}>
              <Row>
                <Col md={11}>
                  <h5>Item Terkait</h5>
                </Col>
                <Col md={1}>
                  <div
                    className="float-right "
                    style={{ cursor: "pointer" }}
                    title="Edit item bundel"
                  >
                    <i
                      className="fa fa-pencil"
                      onClick={() => onEditListItem(item.bundle.ib_idx)}
                    ></i>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={7}>
              <Row>
                <Col md={12}>
                  <label>
                    Nama Bundel <sup className={styles["text-required"]}>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </Col>
                <Col md={10} className="mt-3">
                  <label>Barcode</label>
                  <input
                    type="text"
                    className="form-control"
                    value={barcode}
                    onChange={(event) => setBarcode(event.target.value)}
                  />
                  {barcode === item.bundle.ib_barcode &&
                    submitStatus === "copy" ? (
                    <span className="text-warning">
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>{" "}
                      Barcode ini sudah tersedia, buat barcode baru
                    </span>
                  ) : (
                    ""
                  )}

                </Col>
                <Col md={2} className="mt-4 align-items-center">
                  <div className="mt-4"></div>
                  <Button variant="primary" className="mt-1" onClick={generateString}>
                    <i className="fa fa-random" aria-hidden="true"></i>
                  </Button>
                </Col>
                <Col md={12} className="mt-3">
                  <label>Biaya</label>
                  <input
                    type="number"
                    className="form-control"
                    value={cost}
                    onChange={(event) => setCost(event.target.value)}
                  />
                </Col>
                <Col md={12} className="mt-3">
                  <label>Harga</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />

                </Col>
                <Col md={12} className="mt-3">
                  <label>Note</label>
                  <input
                    type="text"
                    className="form-control"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={5}>
              <LinkedItem data={item.detailBundle} />
            </Col>
          </Row>
          <Col>
            <ButtonAction />
          </Col>
        </div>
      </div>
    </div>
  );
}
