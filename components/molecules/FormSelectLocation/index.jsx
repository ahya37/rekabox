import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState, Fragment } from "react";
import { Dropdown, DropdownButton,Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getItemByLocation } from "../../../services/item";
import { getListLocationItem } from "../../../services/locationitem";

export default function FormSelectLocation() {
  const [location, setLocation] = useState([]);
  const [token, setToken] = useState("");
  const [brMode, setBrMode] = useState("");
  const IMG = process.env.NEXT_PUBLIC_IMG;
  const router = useRouter();

  const dispatch = useDispatch();

  const getListLocationAPI = useCallback(async (value,branch) => {
    const response = await getListLocationItem(value,branch);
    if (response.error) {
      toast.error(response.message);
    } else {
      const dataLocation = response.data.data.location;
      setLocation(dataLocation);
    }
  }, []);

  const tokens = Cookies.get("token");
  const branch = Cookies.get("branch");

  useEffect(() => {
    getListLocationAPI(tokens,branch);
    setToken(tokens);
    const localData  = JSON.parse(localStorage.getItem('branch'));
    setBrMode(localData.br_mode);
  }, []);

  const onSelectLocation = async (value) => {
    const token = Cookies.get("token");
    let locIdx = value;
    const useForm = {
      token,
    };


    const data = new FormData();
    data.append("token", useForm.token);
    const response = await getItemByLocation(locIdx, data, token,branch);
    dispatch(setSelectItemLocation(response?.data.data.item));
    dispatch(setDetailItem({}));
  };

  const onSelectAll = async (value) => {
    const token = Cookies.get("token");
    let locIdx = value;
    const useForm = {
      token,
    };

    const data = new FormData();
    data.append("token", useForm.token);
    const response = await getItemByLocation(locIdx, data, token,branch);
    dispatch(setSelectItemLocation(response?.data.data.item));
    dispatch(setDetailItem({}))
  }
  
  return (
    <Fragment>
      {brMode === "Basic" ? (
        <Button variant="default border border-dark" onClick={() => onSelectAll('all')}>Lihat Semua</Button>
      ) : (
        <DropdownButton
          title="Pilih Lokasi"
          id="dropdown-menu-align-right"
          variant="default"
          className=" rounded-top rounded-bottom col-md-6"
          onSelect={onSelectLocation}
        >
          <Dropdown.Item eventKey="all" href="">
            Semua
          </Dropdown.Item>
          {location.map((location) => (
            <Dropdown.Item
              href=""
              eventKey={location.loc_idx}
              key={location.loc_idx}
              className="col-md-12"
            >
              {location.loc_name}
            </Dropdown.Item>
          ))}

          <Dropdown.Divider />

          <Dropdown.Item
            href=""
            eventKey="some link"
            onClick={() => router.push("/team/location/add")}
          >
            <i className="fa fa-plus"></i> Tambah Lokasi
          </Dropdown.Item>
        </DropdownButton>
      )}
    </Fragment>
  );
}
