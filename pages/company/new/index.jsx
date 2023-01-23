import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { setSaveCompany } from "../../../services/auth";
import { getCity } from "../../../services/location";
import styles from "../../../styles/Fileupload.module.css";
import Select from "react-select";
export default function CreateNewCompany() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cities, setCities] = useState([]);
  const [selectCity, setSelectCity] = useState(null);
  const [address, setAddress] = useState("");
  const [telp, setTelp] = useState("");
  const [fax, setFax] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const getCityAPI = useCallback(async () => {
    const data = await getCity();

    setCities(data.cities);
  }, [getCity]);

  useEffect(() => {
    getCityAPI();
  }, []);

  const optionCities = cities.map((d) => ({
    value: d.ct_name,
    label: d.ct_name,
  }));

  const onSubmit = async () => {
    const selectedCity = selectCity === null ? null : selectCity.value;
    const useForm = {
      name,
      desc,
      selectedCity,
      address,
      telp,
      fax,
      email,
      website,
      image,
    };

    const getLocalForm = localStorage.getItem("user-form");
    const form = JSON.parse(getLocalForm);

    const data = new FormData();
    data.append("co_name", useForm.name);
    data.append("co_desc", useForm.desc);
    data.append("co_city", useForm.selectedCity);
    data.append("co_address", useForm.address);
    data.append("co_phone", useForm.telp);
    data.append("co_fax", useForm.fax);
    data.append("co_email", useForm.email);
    data.append("co_website", useForm.website);
    data.append("co_logo", useForm.image);
    data.append("otp", form.otp);

    setIsLoading(true);
    const result = await setSaveCompany(data);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.message);
    } else {
      const userProfile = result.data.data;
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      toast.success("Berhasil Membuat Aplikasi");
      router.push("/team/info");
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="row justify-content-center sign-up-photo">
          <div className="col-md-12 cols-m-12 ">
            <div className="row justify-content-center">
              <Col md={12} sm={12} xs={12}>
                <div className="form-block">
                  <Row>
                    <Col md={2}></Col>
                    <Col md={10}>
                      <div className="card">
                        <div className="card-body">
                          <div className="ml-4 mb-2">
                            <h5 className="ml-2">Tambahkan Data Perusahaan</h5>
                          </div>
                          <div className="ml-4 mb-2">
                            <Row>
                              <Col md={8} sm={8} xs={8}>
                                <form className="ml-2">
                                  <div className="form-row">
                                    <div className="col-md-12 col-sm-12 mb-3">
                                      <label htmlFor="validationDefault01">
                                        Nama Perusahaan
                                        <sup
                                          className={styles["text-required"]}
                                        >
                                          *
                                        </sup>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control is-invalid"
                                        required
                                        value={name}
                                        onChange={(event) =>
                                          setName(event.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="col-md-12 col-sm-12 mb-3">
                                      <label htmlFor="validationDefault01">
                                        Deskripsi
                                      </label>
                                      <textarea
                                        className="form-control"
                                        value={desc}
                                        onChange={(event) =>
                                          setDesc(event.target.value)
                                        }
                                      ></textarea>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mb-3">
                                      <label htmlFor="validationDefault01">
                                        Kota
                                      </label>
                                      <Select
                                        options={optionCities}
                                        onChange={setSelectCity.bind(this)}
                                        isClearable={true}
                                        instanceId
                                      />
                                    </div>
                                    <div className="col-md-12 col-sm-12 mb-3">
                                      <label htmlFor="validationDefault01">
                                        Alamat
                                      </label>
                                      <textarea
                                        className="form-control"
                                        value={address}
                                        onChange={(event) =>
                                          setAddress(event.target.value)
                                        }
                                      ></textarea>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mb-3">
                                      <label htmlFor="validationDefault01">
                                        Nomor Telepon
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={telp}
                                        onChange={(event) =>
                                          setTelp(event.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="col-md-12 col-sm-12 mb-3">
                                      <label htmlFor="validationDefault01">
                                        Fax
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={fax}
                                        onChange={(event) =>
                                          setFax(event.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="col-md-12 col-sm-12 mb-3">
                                      <label htmlFor="validationDefault01">
                                        Email Perusahaan
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={email}
                                        onChange={(event) =>
                                          setEmail(event.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="col-md-12 col-sm-12 mb-3">
                                      <label htmlFor="validationDefault01">
                                        Website
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={website}
                                        onChange={(event) =>
                                          setWebsite(event.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="col-md-12 col-sm-12 mb-3">
                                      <div className={styles["image-upload"]}>
                                        <label htmlFor="validationDefault01">
                                          Logo
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 mb-3">
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
                                            onChange={(event) => {
                                              const img = event.target.files[0];
                                              setImagePreview(
                                                URL.createObjectURL(img)
                                              );
                                              return setImage(img);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </Col>
                              <Col md={12} sm={12} xs={12}>
                                {isLoading ? (
                                  <Button
                                    variant="primary"
                                    className="mt-4 btn btn-pill btn-sm text-white"
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
                                  <div className="form-group">
                                    <Button
                                      variant="primary"
                                      className="mt-4 btn btn-pill btn-sm text-white"
                                      size="sm"
                                      onClick={onSubmit}
                                    >
                                      Lanjut
                                    </Button>
                                  </div>
                                )}
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
