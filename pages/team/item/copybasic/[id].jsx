import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import { Input, Navbar, Sidebar } from "../../../../components";
import { getChekAuth } from "../../../../services/auth";
import { getListCategory } from "../../../../services/category";
import { getEditItem, setSaveCopyItem } from "../../../../services/item";
import { getListLocationItem } from "../../../../services/locationitem";
import styles from "../../../../styles/Fileupload.module.css";
import { generate } from "../../../../utils/randomstring";
import { setDetailItem, setSelectItemLocation } from "redux/action/item";

export default function CopyItem(props) {
  const { itemDetail } = props;
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState("");
  const [count, setCount] = useState(1);
  const [imagePreview, setImagePreview] = useState("/");
  const [selectCategory, setSelectCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");

  const dispatch = useDispatch();

  const [item, setItem] = useState({
    it_catidx: "",
    it_idx: "",
    it_barcode: "",
    it_name: "",
    it_image: "",
    it_desc: "",
  });

  const router = useRouter();

  const IMG = process.env.NEXT_PUBLIC_IMG;

  const generateString = () => {
    const randomString = generate(10);
    setItem({
      ...item,
      it_barcode: randomString,
    });
  };

  const getListCategoryAPI = useCallback(async (token, branch) => {
    const results = await getListCategory(token, branch);
    const dataCategory = results?.data.data.category;
    setCategory(dataCategory);
  }, []);

  const getListLocationAPI = useCallback(async (token, branch, brMode) => {
    const results = await getListLocationItem(token, branch);
    const dataLocation = results?.data.data.location[0].loc_idx;
    setLocation(dataLocation);
  }, []);


  useEffect(() => {

    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    getListCategoryAPI(token, branch);
    getListLocationAPI(token, branch);
    setItem(itemDetail);
  }, []);

  const optionCategories = category.map((d) => ({
    value: d.cat_idx,
    label: d.cat_name,
  }));

  const onSubmit = async () => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    const selectedCategory = selectCategory === null ? "" : selectCategory.value;

    const useForm = {
      it_idx: item.it_idx,
      it_barcode: item.it_barcode,
      it_catidx: selectedCategory,
      it_name: item.it_name,
      it_desc: item.it_desc,
      count,
      image,
      location,
      token,
      branch
    };

    const data = new FormData();
    data.append("it_idx", useForm.it_idx);
    data.append("it_barcode", useForm.it_barcode);
    data.append("it_catidx", useForm.it_catidx);
    data.append("it_name", useForm.it_name);
    data.append("ic_count", parseFloat(useForm.count));
    data.append("it_image", useForm.image);
    data.append("loc_idx", useForm.selectedLocation);
    data.append("token", useForm.token);
    data.append("it_br_idx", useForm.branch);

    setIsLoading(true);
    const response = await setSaveCopyItem(data, token);
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response?.data.data.message);
      dispatch(setSelectItemLocation([]));
      dispatch(setDetailItem([]));
      router.push("/team/item");
    }
  };

  const onDetail = (value) => {
    router.push(`/team/item/${value}`);
  };

  return (
    <div className="wrapper">
      <Sidebar activeMenu="item" />
      <div id="content-page" className="content-page">
        <Navbar />
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="iq-header-title">
                        <h5>Salin Item</h5>
                      </div>
                      <br />
                      <div className="border-top mb-4">
                        <div className="row">
                          <div className="col-md-9 col-sm-9">
                            <div className="form-group row mt-4">
                              <label className="col-md-3 col-sm-3 col-form-label">
                                <sup className={styles["text-required"]}>*</sup>
                                Barcode
                              </label>
                              <div className="col-md-6 col-sm-6">
                                <Input
                                  value={item.it_barcode}
                                  onChange={(event) =>
                                    setItem({
                                      ...item,
                                      it_barcode: event.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="col-md-1 col-sm-2 mr-1">
                                <div className="mt-1"></div>
                                <Button
                                  variant="primary"
                                  onClick={generateString}
                                >
                                  <i
                                    className="fa fa-random"
                                    aria-hidden="true"
                                  ></i>
                                </Button>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="col-md-3 col-sm-3 col-form-label">
                                <sup className={styles["text-required"]}>*</sup>
                                Nama Barang
                              </label>
                              <div className="col-md-7 col-sm-6">
                                <Input
                                  value={item.it_name}
                                  onChange={(event) =>
                                    setItem({
                                      ...item,
                                      it_name: event.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="form-group row">
                              <label className="col-md-3 col-sm-3 col-form-label">
                                Deskripsi
                              </label>
                              <div className="col-md-7 col-sm-6">
                                <textarea
                                  className="form-control"
                                  id="exampleFormControlTextarea1"
                                  value={item.it_desc}
                                  onChange={(event) =>
                                    setItem({
                                      ...item,
                                      it_desc: event.target.value,
                                    })
                                  }
                                ></textarea>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="col-md-3 col-sm-3 col-form-label">
                                Kategori
                              </label>
                              <div className="col-md-7 col-sm-6">
                                <Select
                                  options={optionCategories}
                                  onChange={setSelectCategory.bind(this)}
                                  isClearable={true}
                                />
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="col-md-3 col-sm-3 col-form-label">
                                <sup className={styles["text-required"]}>*</sup>
                                Jumlah
                              </label>
                              <div className="col-md-7 col-sm-6">
                                <input
                                  type="number"
                                  className="form-control"
                                  min={1}
                                  required
                                  value={count}
                                  onChange={(event) =>
                                    setCount(event.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 col-sm-12">
                            <div className="row mt-4">
                              <div className={styles["sign-up-photo"]}>
                                <div className={styles["image-upload"]}>
                                  <label htmlFor="avatar">
                                    {imagePreview === "/" ? (
                                      <img
                                        src={`${IMG}/${item.it_image}`}
                                        width="200"
                                        height="200"
                                        alt="upload"
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
                                      return setImage(img);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 col-sm-12 mt-4">
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
                                  <a className="btn btn-outline-secondary ml-2 d-none">
                                    Batal
                                  </a>
                                </Link>
                              ) : (
                                <a
                                  href="#"
                                  className="btn btn-outline-secondary ml-2"
                                  onClick={() => onDetail(item.it_idx)}
                                >
                                  Batal
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, params }) {
  const idx = params.id;
  const { token } = req.cookies;

  const auth = await getChekAuth(token);

  if (auth.error || !token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const response = await getEditItem(idx, token);

  return {
    props: {
      itemDetail: response.data.data.item,
    },
  };
}
