import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { getListLocationItem } from "../../../services/locationitem";

export default function FormOptionLocation(props) {
  const [location, setLocation] = useState([]);
  const { placeholderText } = props;

  const dispatch = useDispatch();

  const getListLocationAPI = useCallback(
    async (token,branch) => {
      const response = await getListLocationItem(token,branch);
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

  const handleChange = (e) => {
    if (e === null) {
      dispatch({ type: "SET_SHOW_ITEMS", value: false });
    } else {
      dispatch({ type: "SET_DETAIL_ITEM", value: {} });
      dispatch({ type: "SET_SHOW_ITEMS", value: e });
    }
  };

  return (
    <Select
      placeholder={placeholderText}
      options={optionLocations}
      onChange={handleChange}
      isClearable={true}
      instanceId
    />
  );
}
