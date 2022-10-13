import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getListItem } from "../../../services/item";
import { userProfile } from "../../../utils/sessionstorage";
import TableRow from "./TableRow";

export default function ListItem() {
  const [data, setData] = useState([]);

  const token = userProfile();

  const getListItemApi = useCallback(async () => {
    const response = await getListItem(token);

    if (response.error) {
      toast.error(response.message);
    } else {
      const dataItem = response.data.data.item;
      setData(dataItem);
    }
  }, []);

  useEffect(() => {
    getListItemApi();
  }, []);

  return (
    <div className="col-md-6 border-right border-top">
      <div className="card ">
        <div className="card-body">
          <div className="dropdown show">
            <a
              className="btn  dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Lihat Berdasarkan
            </a>

            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <a className="dropdown-item" href="#">
                Semua
              </a>
              <a className="dropdown-item" href="#">
                Lokasi
              </a>
              <a className="dropdown-item" href="#">
                Nama Item
              </a>
            </div>
          </div>
        </div>
        <div className="table-responsive-sm ">
          <table className="table table-striped">
            <tbody>
              {data.map((item) => (
                <TableRow
                  key={item.it_idx}
                  it_idx={item.it_idx}
                  it_name={item.it_name}
                  it_image={item.it_image}
                  it_serial_number={item.it_serial_number}
                  ic_count={item.ic_count}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
