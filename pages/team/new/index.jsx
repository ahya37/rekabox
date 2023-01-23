import { useRouter } from "next/dist/client/router";
import { Button, Col, Row } from "react-bootstrap";

export default function TeamNew() {
  const router = useRouter();
  const onBack = () => {
    router.push("/sign-up");
  };
  const onInfo = () => {
    router.push("/team/info");
  };
  return (
    <div className="container">
      <div className="content">
        <div className="row justify-content-center">
          <div className="col-md-12 cols-m-12 ">
            <div className="row justify-content-center">
              <Col md={12} sm={12} xs={12}>
                <div className="form-block">
                  <Row>
                    <Col md={2} sm={2} xs={2}></Col>
                    <Col md={7} sm={7} xs={7}>
                      <div className="card">
                        <div className="card-body">
                          <Button variant="default" onClick={onBack}>
                            <i className="fa fa-arrow-left mb-4"></i>
                          </Button>
                          <div className="ml-4 mb-2">
                            <h5 className="ml-2">Buat profil team anda</h5>
                          </div>
                          <div className="ml-4 mb-2">
                            <Row>
                              <Col md={8} sm={8} xs={8}>
                                <form className="ml-2">
                                  <div className="form-row">
                                    <div className="col-md-12 col-sm-12 mb-3">
                                      <label htmlFor="validationDefault01">
                                        Nama Tim
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        required
                                        placeholder="Input nama tim Anda"
                                      />
                                    </div>
                                  </div>
                                  <div className="form-row">
                                    <div className="col-md-12 col-sm-12 mb-3">
                                      <label htmlFor="validationDefault01">
                                        Note
                                      </label>
                                      <textarea
                                        className="form-control"
                                        placeholder="input note tim "
                                      ></textarea>
                                    </div>
                                  </div>
                                </form>
                              </Col>
                              <Col md={4} sm={4} xs={4}>
                                <div className="card">
                                  <div className="card-body bg-primary">
                                    <div className="stepwizard mt-4">
                                      <div className="">
                                        <div className="text-center mb-4">
                                          <i className="ri-camera-fill text-white"></i>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col md={12} sm={12} xs={12}>
                                <div className="form-group">
                                  <Button
                                    variant="primary"
                                    className="mt-4 btn btn-pill btn-sm text-white"
                                    size="sm"
                                    onClick={onInfo}
                                  >
                                    Lanjut
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
