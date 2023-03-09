import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import { Button, Spinner, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { setLogin } from "../../../services/auth";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { getMenu, getMyprofile } from "../../../services/users";
import { setMenu } from "redux/action/menu";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onUsername, setOnuserName] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async () => {
    const form = {
      email,
      password,
      username,
    };

    if (!password) {
      toast.error("Email dan Password wajib diisi !");
    } else {
      setIsLoading(true);
      const response = await setLogin(form);
      setIsLoading(false);
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success("Login Berhasil");
        router.push("/team/item");
        const userProfile = response.data;
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
        localStorage.setItem("branch", JSON.stringify(userProfile.data.branch));
        console.log(userProfile.data)

        const token = userProfile.data.access_token;
        const branch = userProfile.data.branch.br_idx;
        Cookies.set("token", token);
        Cookies.set("branch", branch);
        const responseMenu = await getMenu(token, branch);
        dispatch(setMenu(responseMenu.data.data.menu));
        const result = await getMyprofile(token);
        dispatch({ type: "SET_PROFILE", value: result.data.data.user });
      }
    }
  };

  const setOnUsername = (value) => {
    setOnuserName(value);
  };

  return (
    <>
      <div className="form-group  mt-4">
        {onUsername ? (
          <>
            <label htmlFor="username">{username === "" ? "Username" : ""}</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </>
        ) : (
          <div className="form-group last mt-4">
            <label htmlFor="username">{email === "" ? "Email" : ""}</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        )}
      </div>
      <div className="form-group last mb-4">
        <label htmlFor="password">{password === "" ? "Password" : ""}</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="d-flex mb-5 align-items-center">
        <span className="ml-auto">
          Belum punya akun ?
          <Link href="/sign-up">
            <a className="forgot-pass"> Daftar disini</a>
          </Link>
        </span>
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
        <>
          <Row>
            <Col md={6}>
              <button
                type="button"
                className="btn btn-pill text-white btn-block btn-primary mt-2"
                onClick={onSubmit}
              >
                Login
              </button>
            </Col>
            <Col md={6}>
              {onUsername ? (
                <>
                  <button
                    type="button"
                    className="btn btn-pill text-white btn-block btn-secondary mt-2"
                    onClick={() => setOnUsername(false)}
                  >
                    Login dengan email
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-pill text-white btn-block btn-secondary mt-2"
                    onClick={() => setOnUsername(true)}
                  >
                    Login dengan username
                  </button>
                </>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
