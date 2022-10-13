import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { setVerifyOtp } from "../services/auth";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async () => {
    const useForm = {
      otp,
    };

    const data = new FormData();
    data.append("otp", useForm.otp);

    setIsLoading(true);
    const result = await setVerifyOtp(data);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Berhasil Verifikasi");
      localStorage.setItem("user-form", JSON.stringify(useForm));
      router.push("/company/new");
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="row justify-content-center">
          <div className="col-md-8 col-sm-8 contents">
            <div className="row justify-content-center">
              <Col md={8} sm={8} xs={8}>
                <div className="form-block shadow">
                  <div className="mb-4">
                    <h6 className="">
                      Berhasil mendaftar di <strong>RekaBox,</strong>
                      <br />
                      Silahkan verifikasi akun dengan kode OTP yang dikirim
                      melalui email Anda
                    </h6>
                  </div>
                  <div className="form-group  mb-4">
                    <input
                      type="text"
                      className="form-control"
                      id="otp"
                      placeholder="Masukan OTP disini"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                    />
                  </div>
                  {isLoading ? (
                    <Button
                      variant="primary"
                      className="btn btn-pill text-white btn-block btn-primary"
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
                      className="btn btn-pill text-white btn-block btn-primary"
                      onClick={onSubmit}
                    >
                      Simpan
                    </Button>
                  )}
                </div>
              </Col>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
