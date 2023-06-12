import Cookies from "js-cookie";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLogout } from "../../../services/auth";
import { ClearRedux } from "../../../services/redux";
import { getMyprofile } from "../../../services/users";
import { setMenu } from "redux/action/menu";

export default function Profile(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    user_fullname: "",
    user_image: "",
  });

  const dispatch = useDispatch();
  const IMG = process.env.NEXT_PUBLIC_IMG;

  const getUserProfileAPI = useCallback(async (token) => {
    const result = await getMyprofile(token);
    setProfile(result.data.data.user);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      getUserProfileAPI(token);
    }
  }, []);

  const router = useRouter();
  const onLogout = async () => {
    const token = Cookies.get("token");
    const data = new FormData();
    data.append("token", token);

    setIsLoading(true);
    const result = await setLogout(data, token);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Berhasil Logout");
      router.push("/");
    }
    dispatch(setMenu([]));
    dispatch(ClearRedux());
    localStorage.removeItem("userProfile");
    localStorage.removeItem("branch");
    Cookies.remove("token");
    Cookies.remove("branch");
  };

  return (
    <>
      <div
        className="collapse navbar-collapse"
        id="navbarSupportedContent"
      ></div>
      <ul className="navbar-list">
        <li>
          <a
            href="#"
            className="
                      search-toggle
                      iq-waves-effect
                      d-flex
                      align-items-center
                    "
          >
            {profile.user_image === "NULL" ? (
              <Image src="/ilustrations/il-box.svg" width={30} height={30} />
            ) : (
              <img
                src={`${IMG}/${profile.user_image}`}
                className="img-fluid rounded mr-3"
                alt="user"
              />
            )}
          </a>
          <div className="iq-sub-dropdown iq-user-dropdown">
            <div className="card shadow-none m-0">
              <div className="card-header bg-primary">
                <h5 className="card-title text-white">
                  {profile.user_fullname}
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="d-inline-block w-100 p-3">
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
                        className="mr-1"
                      />
                    </Button>
                  ) : (
                    <>
                      <Row>
                        <Col md={12}>
                          <button
                            type="button"
                            className="bg-white iq-sign-btn"
                            role="button"
                            onClick={() => router.push("/team/setting")}
                          >
                            <i className="fa fa-cog" aria-hidden="true"></i>{" "}
                            Profil
                          </button>
                        </Col>
                        <Col md={12}>
                          <button
                            type="button"
                            className="bg-white iq-sign-btn"
                            role="button"
                            onClick={onLogout}
                          >
                            <i className="ri-login-box-line"></i> Sign out
                          </button>
                        </Col>
                      </Row>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}
