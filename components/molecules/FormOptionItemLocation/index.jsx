import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { setFromLocIdx } from "redux/action/item";
import { getItemByLocation } from "../../../services/item";
import {
  getListLocationItem,
  getLocationItem,
} from "../../../services/locationitem";

export default function FormOptionItemLocation(props) {
  const { placeholderText } = props;
  const [location, setLocation] = useState([]);

  const dispatch = useDispatch();

  const getListLocationAPI = useCallback(
    async (token,branch) => {
      const response = await getLocationItem(token,branch);
      const dataLocation = response.data.data.location;
      setLocation(dataLocation);
    },
    [getListLocationItem]
  );

  useEffect(() => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    getListLocationAPI(token,branch);
  }, []);

  const optionLocations = location.map((d) => ({
    value: d.loc_idx,
    label: d.loc_name,
  }));

  const handleChange = async (e) => {
    if (e === null) {
      dispatch({ type: "SET_ITEM_BY_LOCATION", value: [] });
      dispatch({ type: "SET_DETAIL_ITEM", value: {} });
      dispatch({ type: "SET_SHOW_ITEMS", value: false });
      dispatch({ type: "SET_FROM_LOCIDX", value: {} });
    } else {
      const token   = Cookies.get("token");
      const branch  =   Cookies.get("branch");
      const locIdx  = e.value;
      const useForm = {
        token,
      };

      const data = new FormData();
      data.append("token", useForm.token);

      const response = await getItemByLocation(locIdx, data, token,branch);
      const dataItem = response.data.data.item;
      dispatch({ type: "SET_ITEM_BY_LOCATION", value: dataItem });
      dispatch({ type: "SET_DETAIL_ITEM", value: {} });
      dispatch(setFromLocIdx({locIdx}));
    }
  };

  return (
    <Select
      options={optionLocations}
      onChange={handleChange}
      isClearable={true}
      placeholder={placeholderText}
      instanceId
    />
  );
}
