import Cookies from "js-cookie";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { setSaveBranch } from "../../../services/branch";
import styles from "../../../styles/Radiocard.module.css";

export default function BranchContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [mode, setMode] = useState("");

 const onSelectedMode  = (value) => {
   setMode(value);
 }

  const router = useRouter();
  const onBack = () => {
    router.push("/team/item");
  };

  const onSubmit = async () => {
    const token = Cookies.get("token");
    const useForm = {
      name,
      note,
      mode,
    }

   //  SIMPAN KE DB
   const data = new FormData();
   data.append("br_name", useForm.name);
   data.append("br_note", useForm.note);
   data.append("br_mode", useForm.mode);
   data.append("br_class", "Cabang");
   data.append("loc_name", useForm.name);
   data.append("loc_desc", "");
   data.append("token", token);

   setIsLoading(true);
   const response = await setSaveBranch(data, token);
   localStorage.setItem("branch", JSON.stringify(response.data.data.branch));
   Cookies.set("branch", response.data.data.branch.br_idx);
   // UPDATE LOCALSTORAGE BRANCH
   setIsLoading(false);
    if(isLoading === false){
      onBack();
    }
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="mt-4">
            <Button variant="default" onClick={onBack}>
              <i className="fa fa-close mb-4"></i>
            </Button>
          </div>
          <div id="form-wizard1" className="text-center mt-4">
            <ul id="top-tab-list" className="p-0">
              <li className="active">
                <i className="ri-check-fill"></i>
                <span>Profil Cabang</span>
              </li>
              <li>
                <i className="ri-check-fill"></i>
                <span>Pilih Mode</span>
              </li>
              <li>
                <i className="ri-check-fill"></i>
                <span>Selesai</span>
              </li>
            </ul>
            <fieldset>
              <div className="form-card text-left">
                <div className="row">
                  <div className="col-7">
                    <h5 className="mb-4">Buat Profil Cabang</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Nama Cabang</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nama cabang"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Note</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Note cabang"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                name="next"
                className="btn btn-primary next action-button float-right"
                value="next"
                disabled={name === "" ? true : false}>
                Selanjutnya
              </button>
            </fieldset>
            <fieldset>
              <div className="form-card text-left">
                <div className="row">
                  <div className="col-7">
                    <h5 className="mb-4">
                      Pilih mode yang paling cocok untuk Anda
                    </h5>
                  </div>
                </div>
                <div className={styles["card-container"]}>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="card">
                        <input
                          name="plan"
                          className={styles.radio}
                          type="radio"
                          value="Basic"
                          onChange={(event) => onSelectedMode(event.target.value)}
                        />
                        <span className={styles["plan-details"]}>
                          <span className={styles["plan-type"]}>Basic</span>
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
                            Manajemen inventaris termudah mode yang sempurna
                            untuk siapa saja.
                          </span>
                        </span>
                      </label>
                    </div>
                    <div className="col-md-3">
                      <label className="card">
                        <input
                          name="plan"
                          className={styles.radio}
                          type="radio"
                          value="Lokasi"
                          onChange={(event) => onSelectedMode(event.target.value)}
                        />

                        <span className={styles["plan-details"]}>
                          <span className={styles["plan-type"]}>Lokasi</span>
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
                            Mode untuk mengelola produk yang sama tersebar di
                            lokasi yang berbeda.
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
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
                <button
                  type="button"
                  name="next"
                  className="btn btn-primary next action-button float-right"
                  value="next"
                  disabled={mode === "" ? true : false}
                  onClick={onSubmit}
                >
                  Selesai
                </button>
              )}
              <button
                type="button"
                name="previous"
                className="btn btn-dark previous action-button-previous float-right mr-3"
                value="previous"
              >
                Sebelumnya
              </button>
            </fieldset>
           
            <fieldset>
              <div className="form-card">
                <br />
                <h2 className="text-success text-center">
                  <strong>Cabang baru sukses dibuat</strong>
                </h2>
                <br />
                <div className="row justify-content-center">
                  <div className="col-3">
                    <img
                      src="/img/img-success.png"
                      className="fit-image"
                      alt="fit-image"
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
