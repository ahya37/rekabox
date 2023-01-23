import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Col, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setGoHome } from "../../../services/auth";
import { getMenu } from "../../../services/users";

export default function Welcome() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const router = useRouter();

  const onSubmit = async () => {
    const gtLocalUserProfile = localStorage.getItem("userProfile");
    const profile = JSON.parse(gtLocalUserProfile);

    const data = {
      email: profile.user.user_email,
    };

    setIsLoading(true);
    const response = await setGoHome(data);
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
    } else {
      localStorage.removeItem("userProfile");
      const userProfile = response.data;
      const branch      = response.data.data.branch;
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      localStorage.setItem("branch", JSON.stringify(branch));
      const token = userProfile.data.access_token;
      Cookies.set("token", token);
      Cookies.set("branch", response.data.data.branch);

      // SET REDUX APPS MENU
      const responseMenu = await getMenu(token, branch.br_idx);
      dispatch({ type: "SET_MENU", value: responseMenu.data.data.menu });

      toast.success("Login Berhasil");
      router.push("/team/item");
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="row justify-content-center">
          <div className="col-md-6 col-sm-6 contents">
            <div className="row justify-content-center">
              <Col md={8} sm={8} xs={8}>
                <div className="form-block shadow">
                  <div className="mb-4">
                    <h6 className="text-center">
                      Selamat datang di <strong>RekaBox,</strong>
                      <br />
                      mudah dan kelola inventori dengan cepat
                    </h6>
                  </div>
                  <div className="text-center">
                    <Image
                      src="/img/success_factors.svg"
                      width={200}
                      height={200}
                    />
                    <h6 className="text-center">
                      kelola inventori sekarang sudah tersedia dimana saja dari
                      komputer Anda
                    </h6>
                  </div>
                  <div className="text-center">
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
                      <Button variant="primary" onClick={onSubmit}>
                        Mulai kelola inventori
                      </Button>
                    )}
                  </div>
                </div>
              </Col>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
