import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { setUpdateCategory } from "../../../services/category";
import { toast } from "react-toastify";

export default function EditCategoryForm(props) {
  const { data } = props;
  const router = useRouter();
  const [catidx, setCatidx] = useState(data.cat_idx);
  const [catName, setCatName] = useState(data.cat_name);
  const [catDesc, setCatDesc] = useState(data.cat_desc);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    const token = Cookies.get("token");
    const useForm = {
      catidx,
      catName,
      catDesc,
      token,
    };
    const data = new FormData();
    data.append("cat_idx", useForm.catidx);
    data.append("cat_name", useForm.catName);
    data.append("cat_desc", useForm.catDesc);
    data.append("token", useForm.token);

    setIsLoading(true);
    const result = await setUpdateCategory(data, token);
    setIsLoading(false);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Kategori Berhasil Diubah");
      router.push("/team/category");
    }
  };

  return (
    <form>
      <div className="form-row">
        <div className="col-md-6 mb-3">
          <label htmlFor="validationDefaultUsername">Nama</label>
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
