import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getListCategory } from "../../../services/category";
import { setSaveItem } from "../../../services/item";
import {
  getLocationItemByBrIdx,
  getListLocationItem,
} from "../../../services/locationitem";
import styles from "../../../styles/Fileupload.module.css";
import { generate } from "../../../utils/randomstring";
import Select, { StylesConfig } from "react-select";
import Cookie from "js-cookie";
import { Number } from "components";

export default function AddItemFormBasic() {
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [location, setLocation] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [count, setCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [brMode, setBrMode] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState([]);

  const router = useRouter();

  const generateString = () => {
    const randomString = generate(10);
    setBarcode(randomString);
  };

  const token = Cookie.get("token");
  const branch = Cookie.get("branch");

  const getListCategoryAPI = useCallback(async (token, branch) => {
    const response = await getListCategory(token, branch);
    if (response.error) {
      toast.error(response.message);
    } else {
      const dataCategory = response.data.data.category;
      setCategory(dataCategory);
    }
  }, []);

  const getListLocationAPI = useCallback(async (token, branch) => {
    const response = await getListLocationItem(token, branch);
    const dataLocation = response.data.data.location[0];
    setLocation(dataLocation);
  }, []);

  const optionCategories = category.map((d) => ({
    value: d.cat_idx,
    label: d.cat_name,
  }));

  useEffect(() => {
    getListCategoryAPI(token, branch);
    getListLocationAPI(token, branch);
    const localData = JSON.parse(localStorage.getItem("branch"));
    setBrMode(localData.br_mode);
  }, []);

  const onSubmit = async () => {
    const data = new FormData();
    let selectedLocation = "";
    data.append("branch", branch);
    data.append("token", token);
    const result = await getLocationItemByBrIdx(data, token);
    selectedLocation = result?.data.data.data;
    const selectedCategory =
      selectCategory === null ? "" : selectCategory.value;

    const useForm = {
      selectedCategory,
      barcode,
      name,
      desc,
      image,
      token,
      count,
      cost,
      price,
      selectedLocation,
      branch,
    };


    data.append("it_name", useForm.name);
    data.append("ic_count", useForm.count);
    data.append("it_image", useForm.image);
    data.append("token", useForm.token);
    data.append("it_catidx", useForm.selectedCategory);
    data.append("it_barcode", useForm.barcode);
    data.append("loc_idx", useForm.selectedLocation);
    data.append("it_br_idx", useForm.branch);
    data.append("it_cost", useForm.cost);
    data.append("it_price", useForm.price);
    data.append("it_desc", useForm.desc);

    setIsLoading(true);
    const response = await setSaveItem(data, token);
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      setErrors(response.message);
    } else {
      toast.success("Item telah disimpan");
      router.push("/team/item");
    }
  };

  return (
    <Fragment>
      <div className="form-row">
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-10">
              <label htmlFor="validationDefault02">
                Barcode <sup className={styles["text-required"]}>*</sup>
              </label>
              <input
                type="text"
                className={`form-control ${errors.it_barcode && "is-invalid"}`}
                required
                value={barcode}
                onChange={(event) => setBarcode(event.target.value)}
              />
            </div>
            <div className="col-2 mt-3">
              <div className="mt-4"></div>
              <Button variant="primary" onClick={generateString}>
                <i className="fa fa-random" aria-hidden="true"></i>
              </Button>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="validationDefault02">
            Nama Barang <sup className={styles["text-required"]}>*</sup>
          </label>
          <input
            type="text"
            className={`form-control ${errors.it_name && "is-invalid"}`}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="col-md-12 mb-3">
          <label htmlFor="validationDefault05">Deskripsi</label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
          ></textarea>
        </div>

        <div className="col-md-12 mb-3">
          <label>
            Harga Beli <sup className={styles["text-required"]}>*</sup>
          </label>
          <input
            type="number"
            className={`form-control ${errors.it_cost && "is-invalid"}`}
            required
            value={cost}
            onChange={(event) => setCost(event.target.value)}
          />
          <div className="mt-1 ml-1 text-primary">
            <Number value={cost} />
          </div>
        </div>
        <div className="col-md-12 mb-3">
          <label>
            Harga Jual<sup className={styles["text-required"]}>*</sup>
          </label>
          <input
            type="number"
            className={`form-control ${errors.it_price && "is-invalid"}`}
            required
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
          <div className="mt-1 ml-1 text-primary">
            <Number value={price} />
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <div className="row">
            <div className="col-md-11 col-sm-11">
              <label htmlFor="validationDefault03">
                Kategori Produk <sup className={styles["text-required"]}>*</sup>
              </label>
              <Select
                options={optionCategories}
                onChange={setSelectCategory.bind(this)}
                isClearable={true}
                instanceId
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: errors.it_catidx ? "red" : "grey",
                  }),
                }}
              />
            </div>
            <div className="col-md-1 col-sm-1 mt-3 float-right">
              <div className="mt-3"></div>
              <Button
                variant="primary"
                onClick={() => router.push("/team/category/add")}
              >
                <i className="fa fa-plus text-center" aria-hidden="true"></i>
              </Button>
            </div>
          </div>
        </div>
        <div className="col-md-12 mb-3">
          <label>
            Jumlah <sup className={styles["text-required"]}>*</sup>
          </label>
          <input
            type="number"
            className={`form-control ${errors.ic_count && "is-invalid"}`}
            min={1}
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
        </div>

        <div className="col-md-12 mb-3">
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
          <Button variant="primary" onClick={onSubmit}>
            Simpan
          </Button>
        )}
        {isLoading ? (
          <Link href="/team/item">
            <a className="btn btn-outline-secondary ml-2 d-none">Batal</a>
          </Link>
        ) : (
          <Link href="/team/item">
            <a className="btn btn-outline-secondary ml-2">Batal</a>
          </Link>
        )}
      </div>
    </Fragment>
  );
}
