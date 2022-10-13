import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { setSaveUsers } from "../../../services/users";
import styles from "../../../styles/Fileupload.module.css";

export default function AddUsersForm() {
  const [userFullname, setUserFullname] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectLevel, setSelectLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const optionLevel = [
    { value: "member", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  const onSubmit = async () => {
    const selectedLevel = selectLevel === null ? null : selectLevel.value;

    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    const formData = {
      token,
      userFullname,
      userName,
      password,
      email,
      image,
      userPhone,
      selectedLevel,
      branch
    };

    const data = new FormData();
    data.append("token", formData.token);
    data.append("user_fullname", formData.userFullname);
    data.append("user_name", formData.userName);
    data.append("upass", formData.password);
    data.append("email", formData.email);
    data.append("user_image", formData.image);
    data.append("user_phone", formData.userPhone);
    data.append("level_type", formData.selectedLevel);
    data.append("user_br_idx", formData.branch);

    setIsLoading(true);
    const result = await setSaveUsers(data, token);
    setIsLoading(false);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Pengguna Berhasil Disimpan");
      router.push("/team/users");
    }
  };

  const ActionButton = () => {
    return (
      <>
        <Button variant="primary" onClick={onSubmit}>
          Simpan
        </Button>
        <Link href="/team/category">
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
              value={userFullname}
              onChange={(event) => setUserFullname(event.target.value)}
              required
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
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              required
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
              type="text"
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="validationDefaultUsername">Telepon</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={userPhone}
              onChange={(event) => setUserPhone(event.target.value)}
              required
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
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    width={120}
                    height={120}
                    alt="upload"
                  />
                ) : (
                  <Image
                    src="/icon/upload.svg"
                    width={120}
                    height={120}
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
                  return setImage(img);
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
