import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { setSaveCatgory } from "../../../services/category";
import styles from "../../../styles/Fileupload.module.css";
import Cookie from "js-cookie";

export default function AddCategoryForm() {
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async () => {
    const getLocalForm = localStorage.getItem("userProfile");
    const userProfileInfo = JSON.parse(getLocalForm);

    const token = Cookie.get('token');
    const branch = Cookie.get('branch');
    const userIdx = userProfileInfo.data.user.user_id;
    const formData = {
      catName,
      catDesc,
      token,
      branch
    };

    const data = new FormData();
    data.append("useridx", userIdx);
    data.append("cat_name", formData.catName);
    data.append("cat_desc", formData.catDesc);
    data.append("token", formData.token);
    data.append("br_idx", formData.branch);

    setIsLoading(true);
    const result = await setSaveCatgory(data, token);
    setIsLoading(false);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Lokasi Berhasil Disimpan");
      router.push("/team/category");
    }
  };

  return (
    <form>
      <div className="form-row">
        <div className="col-md-6 mb-3">
          <label htmlFor="validationDefaultUsername">
            Nama <sup className={styles["text-required"]}>*</sup>
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={catName}
              onChange={(event) => setCatName(event.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-md-12 mb-3">
          <label htmlFor="validationDefault05">Deskripsi</label>
          <textarea
            className="form-control"
            value={catDesc}
            onChange={(event) => setCatDesc(event.target.value)}
            required
          ></textarea>
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
          <Button variant="primary" onClick={onSubmit}>
            Simpan
          </Button>
        )}

        <Link href="/team/category">
          <a className="btn btn-outline-secondary ml-2" type="submit">
            Batal
          </a>
        </Link>
      </div>
    </form>
  );
}
