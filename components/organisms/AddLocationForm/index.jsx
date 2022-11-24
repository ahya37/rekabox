import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Spinner, ProgressBar } from "react-bootstrap";
import { toast } from "react-toastify";
import { setSaveLocation } from "../../../services/location";
import Cookie from "js-cookie";

export default function AddLocationForm() {
  const [locName, setLocName] = useState("");
  const [locDesc, setLocDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async () => {
    const token = Cookie.get('token');
    const branch = Cookie.get('branch');
    const formData = {
      locName,
      locDesc,
      token,
      branch
    };

    const data = new FormData();
    data.append("loc_name", formData.locName);
    data.append("loc_desc", formData.locDesc);
    data.append("br_idx", formData.branch);
    data.append("token", formData.token);

    setIsLoading(true);
    const result = await setSaveLocation(data, token);

    setIsLoading(false);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Lokasi Berhasil Disimpan");
      router.push("/team/location");
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
          <label htmlFor="validationDefaultUsername">Nama</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={locName}
              onChange={(event) => setLocName(event.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-md-12 mb-3">
          <label htmlFor="validationDefault05">Deskripsi</label>
          <textarea
            className="form-control"
            value={locDesc}
            onChange={(event) => setLocDesc(event.target.value)}
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
          <ActionButton />
        )}
      </div>
    </form>
  );
}
