import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { setSignUp } from "../../../services/auth";
import { toast } from "react-toastify";

export default function SignUpForm() {
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async () => {
    const useForm = {
      userFullName,
      userEmail,
      userPass,
    };

    const data = new FormData();
    data.append("userFullName", useForm.userFullName);
    data.append("userEmail", useForm.userEmail);
    data.append("userPass", useForm.userPass);

    setIsLoading(true);
    const result = await setSignUp(data);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Berhasil Mendaftar");
      router.push("/verify");
    }
  };

  return (
    <>
      <form action="#" method="post" className="mt-4">
        <div className="form-group first">
          <input
            type="text"
            className="form-control"
            id="name"
            value={userFullName}
            placeholder="Nama Lengkap"
            required
            onChange={(event) => setUserFullName(event.target.value)}
          />
        </div>
        <div className="form-group first">
          <input
            type="text"
            className="form-control"
            id="username"
            value={userEmail}
            placeholder="Email"
            required
            onChange={(event) => setUserEmail(event.target.value)}
          />
        </div>
        <div className="form-group last mb-4">
          <input
            type="password"
            className="form-control"
            id="password"
            value={userPass}
            placeholder="Password"
            required
            onChange={(event) => setUserPass(event.target.value)}
          />
        </div>

        <div className="d-flex mb-5 align-items-center">
          <span className="ml-auto">
            <Link href="/sign-in">
              <a className="forgot-pass">Log In</a>
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
          <Button
            variant="primary"
            className="btn btn-pill text-white btn-block btn-primary"
            onClick={onSubmit}
          >
            Sign Up
          </Button>
        )}
      </form>
    </>
  );
}
