import { Button, Col, Row, Spinner } from "react-bootstrap";
import { getCity } from "../../../services/location";
import { useCallback, useEffect, useState } from "react";
import styles from "../../../styles/Fileupload.module.css";
import Select from "react-select";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { getSetting, setUpdateCompany } from "../../../services/users";
import { useRouter } from "next/router";

export default function Company(props) {
  const { data } = props;
  const [edit, setEdit] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectCity, setSelectCity] = useState(data.co_city);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState({
    co_id: "",
    co_name: "",
    co_desc: "",
    co_city: "",
    co_address: "",
    co_telp: "",
    co_fax: "",
    co_email: "",
    co_website: "",
    co_logo: "",
  });

  const router = useRouter();
  const IMG = process.env.NEXT_PUBLIC_IMG;

  const getCityAPI = useCallback(async () => {
    const data = await getCity();

    setCities(data.cities);
  }, [getCity]);

  useEffect(() => {
    getCityAPI();
    setCompany(data);
  }, []);

  const optionCities = cities.map((d) => ({
    value: d.ct_name,
    label: d.ct_name,
  }));

  const onEdit = (value) => {
    if (value === true) {
      setEdit(value);
    } else {
      setEdit(value);
    }
  };

  const onSubmit = async () => {
    const selectedCity = selectCity === null ? null : selectCity.value;
    const token = Cookies.get("token");

    const useForm = {
      co_id: company.co_id,
      co_name: company.co_name,
      co_desc: company.co_desc,
      co_city: !selectedCity ? company.co_city : selectedCity,
      co_address: company.co_address,
      co_telp: company.co_phone,
      co_fax: company.co_fax,
      co_email: company.co_email,
      co_website: company.co_website,
      co_logo: company.co_logo,
      token,
    };

    const data = new FormData();
    data.append("co_id", useForm.co_id);
    data.append("co_name", useForm.co_name);
    data.append("co_desc", useForm.co_desc);
    data.append("co_city", useForm.co_city);
    data.append("co_address", useForm.co_address);
    data.append("co_phone", useForm.co_telp);
    data.append("co_fax", useForm.co_fax);
    data.append("co_email", useForm.co_email);
    data.append("co_website", useForm.co_website);
    data.append("co_logo", useForm.co_logo);
    data.append("token", useForm.token);

    setIsLoading(true);
    const result = await setUpdateCompany(data, token);
    setIsLoading(false);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Profil perusahaan berhasil diubah");
      setEdit(false);
      const response = await getSetting(token);
      setCompany(response.data.data.company);
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
              Info Perusahaan <i className="fa fa-question-circle"></i>
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
              <Col md={6}>Nama Perusahaan</Col>
              <Col md={6}>
                {edit === true ? (
                  <input
                    type="text"
                    className="form-control is-invalid"
                    required
                    value={company.co_name}
                    onChange={(event) =>
                      setCompany({
                        ...company,
                        co_name: event.target.value,
                      })
                    }
                  />
                ) : (
                  <h6>{company.co_name ? company.co_name : "-"}</h6>
                )}
              </Col>
            </Row>
          </Col>
          <Col md={12} className="mt-2">
            <Row>
              <Col md={6}>Deskripsi</Col>
              <Col md={6}>
                {edit === true ? (
                  <textarea
                    className="form-control"
                    value={company.co_desc}
                    onChange={(event) =>
                      setCompany({
                        ...company,
                        co_desc: event.target.value,
                      })
                    }
                  ></textarea>
                ) : (
                  <h6>{company.co_desc ? company.co_desc : "-"}</h6>
                )}
              </Col>
            </Row>
          </Col>
          <Col md={12} className="mt-2">
            <Row>
              <Col md={6}>Kota</Col>
              <Col md={6}>
                {edit === true ? (
                  <Select
                    options={optionCities}
                    onChange={setSelectCity.bind(this)}
                    isClearable={true}
                  />
                ) : (
                  <h6>{company.co_city ? company.co_city : "-"}</h6>
                )}
              </Col>
            </Row>
          </Col>
          <Col md={12} className="mt-2">
            <Row>
              <Col md={6}>Alamat</Col>
              <Col md={6}>
                {edit === true ? (
                  <textarea
                    className="form-control"
                    value={company.co_address}
                    onChange={(event) =>
                      setCompany({
                        ...company,
                        co_address: event.target.value,
                      })
                    }
                  ></textarea>
                ) : (
                  <h6>{company.co_address ? company.co_address : "-"}</h6>
                )}
              </Col>
            </Row>
          </Col>
          <Col md={12} className="mt-2">
            <Row>
              <Col md={6}>Nomor Telepon</Col>
              <Col md={6}>
                {edit === true ? (
                  <input
                    type="text"
                    className="form-control"
                    value={company.co_phone}
                    onChange={(event) =>
                      setCompany({
                        ...company,
                        co_phone: event.target.value,
                      })
                    }
                  />
                ) : (
                  <h6>{company.co_phone ? company.co_phone : "-"}</h6>
                )}
              </Col>
            </Row>
          </Col>
          <Col md={12} className="mt-2">
            <Row>
              <Col md={6}>Fax</Col>
              <Col md={6}>
                {edit === true ? (
                  <input
                    type="text"
                    className="form-control"
                    value={company.co_fax}
                    onChange={(event) =>
                      setCompany({
                        ...company,
                        co_fax: event.target.value,
                      })
                    }
                  />
                ) : (
                  <h6>{company.co_fax ? company.co_fax : "-"}</h6>
                )}
              </Col>
            </Row>
          </Col>
          <Col md={12} className="mt-2">
            <Row>
              <Col md={6}>Email Perusahaan</Col>
              <Col md={6}>
                {edit === true ? (
                  <input
                    type="text"
                    className="form-control"
                    value={company.co_email}
                    onChange={(event) =>
                      setCompany({
                        ...company,
                        co_email: event.target.value,
                      })
                    }
                  />
                ) : (
                  <h6>{company.co_email ? company.co_email : "-"}</h6>
                )}
              </Col>
            </Row>
          </Col>
          <Col md={12} className="mt-2">
            <Row>
              <Col md={6}>Website</Col>
              <Col md={6}>
                {edit === true ? (
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={company.co_website}
                    onChange={(event) =>
                      setCompany({
                        ...company,
                        co_website: event.target.value,
                      })
                    }
                  />
                ) : (
                  <h6>{company.co_website ? company.co_website : "-"}</h6>
                )}
              </Col>
            </Row>
          </Col>
          <Col md={12} className="mt-2">
            <Row>
              <Col md={6}>Logo</Col>
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
                            src={`${IMG}/${company.co_logo}`}
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
                          return setCompany({
                            ...company,
                            co_logo: img,
                          });
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <img
                    src={`${IMG}/${company.co_logo}`}
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
