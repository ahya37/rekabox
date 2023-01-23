import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { getSetting, setUpdateProfileUser } from "../../../services/users";
import styles from "../../../styles/Fileupload.module.css";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function UserProfile(props) {
  const { data } = props;
  const [edit, setEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [userPass, setUserPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    user_fullname: "",
    user_image: "",
  });

  const router = useRouter();
  const IMG = process.env.NEXT_PUBLIC_IMG;

  useEffect(() => {
    setProfile(data);
  }, []);

  const onEdit = (value) => {
    if (value === true) {
      setEdit(value);
    } else {
      setEdit(value);
    }
  };

  const onSubmit = async () => {
    const token = Cookies.get("token");

    const useForm = {
      user_fullname: profile.user_fullname,
      user_image: profile.user_image,
      userPass,
      token,
    };

    const data = new FormData();
    data.append("name", useForm.user_fullname);
    data.append("password", useForm.userPass);
    data.append("image", useForm.user_image);
    data.append("token", useForm.token);

    setIsLoading(true);
    const result = await setUpdateProfileUser(data, token);
    setIsLoading(false);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Profil berhasil diubah");
      setEdit(false);
      const response = await getSetting(token);
      setProfile(response.data.data.user);
      router.push("/team/setting");
    }
  };

  return (
    <>
      <Row>
        <Col md={10}>
          <Button
            variant="default"
            className="float-left"
            onClick={() => onEdit(false)}
          >
            <h5>
              Info Pengguna <i className="fa fa-question-circle"></i>
            </h5>
          </Button>
        </Col>
        <Col md={2}>
          <Button
            variant="default border"
            className="float-right"
            onClick={() => onEdit(true)}
          >
            <i className="fa fa-edit"></i> Edit
          </Button>
        </Col>
      </Row>
      <Col md={12}>
        <div className="border-bottom"></div>
        <Row>
          <Col md={12} className="mt-2">
            <Row>
              <Col md={6}>Nama</Col>
              <Col md={6}>
                {edit === true ? (
                  <input
                    type="text"
                    className="form-control is-invalid"
                    value={profile.user_fullname}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        user_fullname: event.target.value,
                      })
                    }
                  />
                ) : (
                  <h6>{profile.user_fullname}</h6>
                )}
              </Col>
            </Row>
          </Col>
          <Col md={12} className="mt-2">
            <Row>
              <Col md={6}>Password</Col>
              <Col md={6}>
                {edit === true ? (
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={userPass}
                    placeholder="Password"
                    required
                    onChange={(event) => setUserPass(event.target.value)}
                  />
                ) : (
                  <h6>-</h6>
                )}
              </Col>
            </Row>
          </Col>

          <Col md={12} className="mt-2">
            <Row>
              <Col md={6}>Foto</Col>
              <Col md={6}>
                {edit === true ? (
                  <div className={styles["sign-up-photo"]}>
                    <div className={styles["image-upload"]}>
                      <label htmlFor="avatar">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            width={120}
                            height={120}
                            alt="upload"
                          />
                        ) : (
                          <img
                            src={`${IMG}/${profile.user_image}`}
                            width="120"
                            height="120"
                            alt="upload"
                          />
                        )}
                      </label>
                      <input
                        id="avatar"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(event) => {
                          const img = event.target.files[0];
                          setImagePreview(URL.createObjectURL(img));
                          return setProfile({
                            ...profile,
                            user_image: img,
                          });
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <img
                    src={`${IMG}/${profile.user_image}`}
                    width="120"
                    height="120"
                    alt="Tidak ada logo"
                  />
                )}
              </Col>
            </Row>
          </Col>
          <Col md={12} sm={12} xs={12}>
            {edit === true ? (
              isLoading ? (
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
                  <Button
                    variant="primary"
                    className="mr-2 btn btn-pill btn-sm text-white"
                    onClick={onSubmit}
                  >
                    Simpan
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => onEdit(false)}
                    className="border"
                  >
                    Batal
                  </Button>
                </>
              )
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Col>
    </>
  );
}
