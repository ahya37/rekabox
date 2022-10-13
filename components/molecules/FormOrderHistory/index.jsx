import Cookies from "js-cookie";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { setUseFormListHistories } from "../../../redux/action/history";
import { getListHistories } from "../../../services/history";
import { getListItem } from "../../../services/item";
import { getReportInventory } from "../../../services/report";
import {
  getListLocationItem,
  getLocationItem,
} from "../../../services/locationitem";
import { getListUsers } from "../../../services/users";
import ExportExcel from "../../organisms/ExportExcel";

export default function FormOrderHistory(props) {
  const {brMode} = props;
  const [user, setUser] = useState([]);
  const [location, setLocation] = useState([]);
  const [selectTransaction, setSelectTransaction] = useState(null);
  const [selectItem, setSelectItem] = useState(null);
  const [selectLocation, setSelectLocation] = useState(null);
  const [selectUser, setSelectUser] = useState(null);
  const [selectDateRange, setSelectDateRange] = useState(null);

  const dispatch = useDispatch();

  const [daterange, setDaterange] = useState({
    startDate: moment().format("MM/DD/YYYY"),
    endDate: moment().format("MM/DD/YYYY"),
    locale: {
      cancelLabel: "Semua",
    },
  });


  let optionsTransaction = [];
  if(brMode === 'Basic'){
    // [OPTION TRANSACTION]
    optionsTransaction = [
      { value: "in", label: "Stok Masuk" },
      { value: "out", label: "Stok Keluar" },
      { value: "audit", label: "Audit" }
    ];
  }else{
    optionsTransaction = [
      { value: "in", label: "Stok Masuk" },
      { value: "out", label: "Stok Keluar" },
      { value: "audit", label: "Audit" },
      { value: "move", label: "Pindah" },
    ];
  }



  // [CLOSE OPTION TRANSACTION]

  //   [OPTION ITEM]
  const [item, setItem] = useState([]);

  const getOptionItemAPI = useCallback(async (token,branch) => {
    const response = await getListItem(token,branch);
    setItem(response?.data.data.item);
  });

  //   [OPTION  LOCATION]
  const getListLocationAPI = useCallback(
    async (token,branch) => {
      const response = await getLocationItem(token,branch);
      const dataLocation = response.data.data.location;
      setLocation(dataLocation);
    },
    [getListLocationItem]
  );
  const optionLocations = location.map((d) => ({
    value: d.loc_idx,
    label: d.loc_name,
  }));
  //   [CLOSE OPTION  LOCATION]
  //   [OPTION MEMBER]
  const getOptionUserAPI = useCallback(async (token,branch) => {
    const response = await getListUsers(token,branch);
    setUser(response.data.data.users);
  });
  const optionUser = user.map((d) => ({
    value: d.user_id,
    label: d.user_fullname,
  }));
  optionUser.unshift({ label: "All Anggota", value: "" });
  //   [CLOSE OPTION MEMBER]

  useEffect(() => {
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    getOptionItemAPI(token,branch);
    getListLocationAPI(token,branch);
    getOptionUserAPI(token,branch);
  }, []);

  const optionItem = item.map((d) => ({
    value: d.it_idx,
    label: d.it_name,
  }));
  optionItem.unshift({ label: "All Item", value: "" });

  // [CLOSE OPTION ITEM]

  useEffect(() => {
    dispatch(setUseFormListHistories());
  }, []);

  // [CLOSE OPTION DATERANGE]

  const onSubmit = async () => {
    const selectedTransaction =
      selectTransaction === null ? "" : selectTransaction.value;

    const selectedItem = selectItem === null ? "" : selectItem.value;

    const selectedLocation =
      selectLocation === null ? "" : selectLocation.value;

    const selectedUser = selectUser === null ? "" : selectUser.value;
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");

    const selectedDate = selectDateRange === null ? "" : selectDateRange;

    const useForm = {
      token,
      selectedDate,
      selectedTransaction,
      selectedItem,
      selectedLocation,
      selectedUser,
      branch
    };

    const data = new FormData();
    data.append("token", useForm.token);
    data.append("daterange", useForm.selectedDate);
    data.append("in_status", useForm.selectedTransaction);
    data.append("in_itidx", useForm.selectedItem);
    data.append("in_locidx", useForm.selectedLocation);
    data.append("in_useridx", useForm.selectedUser);
    data.append("branch", useForm.branch);

    const response = await getListHistories(data, token);
    const responseReport = await getReportInventory(data, token);
    dispatch({
      type: "SET_LIST_HISTORIES",
      value: response?.data.data.histories,
    });
    dispatch({
      type: "SET_DETAIL_HISTORY",
      value: null,
    });
    dispatch({
      type: "SET_DATA_REPORT",
      value: responseReport?.data.data.report,
    });
  };

  const clearDate = (event, picker) => {
    const d = picker.element.val("Semua");
    setSelectDateRange("");
  };

  const dateExportDefault = daterange.startDate + "-" + daterange.endDate;

  return (
    <Row>
      <Col xs={4} sm={4} md={3} className="mt-2">
        <DateRangePicker
          initialSettings={daterange}
          value={daterange}
          onApply={(event) => setSelectDateRange(event.target.value)}
          onCancel={clearDate}
        >
          <input type="text" className="form-control" />
        </DateRangePicker>
      </Col>
      <Col xs={4} md={3} sm={4} className="mt-2">
        <Select
          options={optionsTransaction}
          placeholder={"Transaksi"}
          isClearable={true}
          onChange={setSelectTransaction.bind(this)}
          instanceId
        />
      </Col>
      <Col xs={4} md={2} sm={4} className="mt-2">
        <Select
          placeholder={"Item"}
          onChange={setSelectItem.bind(this)}
          options={optionItem}
          isClearable={true}
          instanceId
        />
      </Col>
        {brMode === 'Lokasi' ? (
          <Col xs={4} md={2} sm={4} className="mt-2">
            <Select
              options={optionLocations}
              onChange={setSelectLocation.bind(this)}
              isClearable={true}
              placeholder={"Lokasi"}
              instanceId
            />
            </Col>
        ) : (
          ""
        )}
      <Col xs={4} md={2} sm={4} className="mt-2">
        <Select
          options={optionUser}
          isClearable={true}
          onChange={setSelectUser.bind(this)}
          instanceId
          placeholder={"Anggota"}
        />
      </Col>
      <Col xs={12} md={12} sm={12} className="mt-2">
        <Button onClick={onSubmit}>Tampilkan</Button>
        <ExportExcel
          fileName={`Laporan Inventory - ${
            selectDateRange === null ? dateExportDefault : selectDateRange
          } `}
        />
      </Col>
    </Row>
  );
}
