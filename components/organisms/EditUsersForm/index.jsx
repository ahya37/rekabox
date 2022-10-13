import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { setSaveUsers, setUpdateUsers } from "../../../services/users";
import styles from "../../../styles/Fileupload.module.css";

export default function EditUsersForm(props) {
  const { data } = props;
  const [userFullname, setUserFullname] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [imagePreview, setImagePreview] = useState("/");
  const [selectLevel, setSelectLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    user_id: "",
    user_fullname: "",
    user_email: "",
    user_phone: "",
    user_image: "",
  });

  const router = useRouter();
  const IMG = process.env.NEXT_PUBLIC_IMG;

  useEffect(() => {
    setUser(data);
  }, []);

  const optionLevel = [
    { value: "member", label: "User" },
    { value: "admin", label: "Administrator" },
  ];

  const onSubmit = async () => {
    const selectedLevel = selectLevel === null ? "" : selectLevel.value;
    const token = Cookies.get("token");

    const formData = {
      token,
      userid: user.user_id,
      userFullname: user.user_fullname,
      email: user.user_email,
      image: user.user_image,
      userPhone: user.user_phone,
      selectedLevel,
      password,
    };

    const data = new FormData();
    data.append("token", formData.token);
    data.append("user_fullname", formData.userFullname);
    data.append("upass", formData.password);
    data.append("email", formData.email);
    data.append("user_image", formData.image);
    data.append("user_phone", formData.userPhone);
    data.append("level_type", formData.selectedLevel);
    data.append("user_id", formData.userid);

    setIsLoading(true);
    const result = await setUpdateUsers(data, token);
    setIsLoading(false);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Pengguna Berhasil Diubah");
      router.push("/team/users");
    }
  };

  const ActionButton = () => {
    return (
      <>
        <Button variant="primary" onClick={onSubmit}>
          Simpan
        </Button>
        <Link href="/team/users">
          <a className="btn btn-outline-secondary ml-2" type="submit">
            Batal
          </a>
        </Link>
      </>
    );
  };

  return (
    <form>
      <div className="form-row">
        <div className="col-md-6 mb-3">
          <label htmlFor="validationDefaultUsername">
            Nama
            <sup className={styles["text-required"]}>*</sup>
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={user.user_fullname}
              required
              onChange={(event) =>
                setUser({
                  ...user,
                  user_fullname: event.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="validationDefaultUsername">
            Username
            <sup className={styles["text-required"]}>*</sup>
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={user.user_name}
              onChange={(event) =>
                setUser({
                  ...user,
                  user_name: event.target.value,
                })
              }
              readOnly
            />
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="validationDefaultUsername">
            Password
            <sup className={styles["text-required"]}>*</sup>
          </label>
          <div className="input-group">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="validationDefaultUsername">Email</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              required
              value={user.user_email}
              onChange={(event) =>
                setUser({
                  ...user,
                  user_email: event.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="validationDefaultUsername">Telepon</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              required
              value={user.user_phone}
              onChange={(event) =>
                setUser({
                  ...user,
                  user_phone: event.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="validationDefaultUsername">Level</label>
          <div className="input-group">
            <Select
              options={optionLevel}
              onChange={setSelectLevel.bind(this)}
              isClearable={true}
              instanceId
              className="col-md-12"
            />
          </div>
        </div>
        <div className="col-md-12 mb-3">
          <label htmlFor="validationDefaultUsername">Foto</label>
          <div className={styles["sign-up-photo"]}>
            <div className={styles["image-upload"]}>
              <label htmlFor="avatar">
                {user.user_image === "" ? (
                  <img
                    src="/icon/upload.svg"
                    width={120}
                    height={120}
                    alt="upload"
                  />
                ) : imagePreview === "/" ? (
                  <img
                    src={`${IMG}/${user.user_image}`}
                    width="150"
                    alt="upload"
                    className="rounded"
                  />
                ) : (
                  <img
                    src={imagePreview}
                    width="200"
                    height="200"
                    alt="upload"
                  />
                )}
              </label>

              <input
                id="avatar"
                type="file"
                accept="image/png, image/jpeg"
                required
                onChange={(event) => {
                  const img = event.target.files[0];
                  setImagePreview(URL.createObjectURL(img));
                  return setUser({
                    ...user,
                    user_image: img,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
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
          <ActionButton />
        )}
      </div>
    </form>
  );
}
