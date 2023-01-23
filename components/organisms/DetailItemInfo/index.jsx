import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getHistoryByLocation, setDeleteItem } from "../../../services/item";
import Menu from "./Menu";

export default function DetailItemInfo(props) {
  const { item, idx, location } = props;
  const IMG = process.env.NEXT_PUBLIC_IMG;
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const history = async (value) => {
    const token = Cookies.get("token");
    const lc_idx = value.lc_idx;
    const lc_loidx = value.lc_loidx;

    const useForm = {
      token,
    };

    data = new FormData();
    data.append("token", useForm.token);

    setIsLoading(true);
    const response = await getHistoryByLocation(
      lc_idx,
      idx,
      lc_loidx,
      data,
      token
    );
    
    setIsLoading(true);
    dispatch({ type: "SET_HISTORY_BY_LOCATION", value: response?.data.data });
    dispatch({ type: "SET_DETAIL_HISTORY", value: [] });
  };

  const onDelete = (value) => {
    const itName = value.it_name;
    const ic_itidx = value.it_idx;
    const tokenDelete = Cookies.get("token");

    const formDelete = {
      ic_itidx,
      tokenDelete,
    };
    const dataDelete = new FormData();
    dataDelete.append("ic_itidx", formDelete.ic_itidx);
    dataDelete.append("token", formDelete.tokenDelete);

    Swal.fire({
      text: `Hapus Item  ${itName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await setDeleteItem(dataDelete, tokenDelete);
        setIsLoading(false);
        if (response.error) {
          Swal.fire(response.message, "", "error");
        } else {
          Swal.fire("Terhapus", "", "success");
          dispatch({ type: "SET_ITEM_BY_LOCATION", value: [] });
          dispatch({ type: "SET_DETAIL_ITEM", value: {} });
          router.push("/team/item");
        }
      }
    });
  };

  return (
    <div className="col-md-7">
      <div className="iq-header-title">
        <h5>Detail Item</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6"></div>
          <div className="col-md-6 text-right">
            <div className="iq-header-title">
              <Menu title="Edit" href={`/team/item/edit/${idx}`} />
              <Menu title="Salin" href={`/team/item/copy/${idx}`} />
              <Button
                variant="default"
                className="border ml-2"
                onClick={() => onDelete(item)}
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-top mb-4">
        <div className="row">
          <div className="col-md-10">
            <div className="row">
              <div className="col-md-3">
                <h6 className="mt-4">
                  <img src="/icon/star.svg" width="8" className="mb-1 ml-1" />
                  Barcode
                </h6>
              </div>
              <div className="col-md-4 col-sm-4">
                <h6 className="mt-4">{item.it_barcode}</h6>
              </div>
              <div className="col-md-3 col-sm-3">
                <button type="button" className="btn btn-sm btn-primary mt-4">
                  Print Label
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 col-sm3">
                <h6 className="mt-4">
                  <img src="/icon/star.svg" width="8" className="mb-1 ml-1" />
                  Nama
                </h6>
              </div>
              <div className="col-md-3 col-sm-3">
                <h6 className="mt-4">{item.it_name}</h6>
              </div>
            </div>
          </div>
          <div className="col-md-2 mt-4">
            {item.it_image !== "NULL" ? (
              <img
                src={`${IMG}/${item.it_image}`}
                width={70}
                height={70}
                className="rounded-top rounded-bottom "
              />
            ) : (
              <Image src="/icon/broken_image.svg" width={50} height={50} />
            )}
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-9">
              <div className="iq-header-title">
                <h5>Lokasi Stok</h5>
              </div>
            </div>
          </div>
          <div className="border-top mt-2">
            {location.map((row) => (
              <a href="#" onClick={() => history(row)} key={row.lc_idx}>
                <div className="mt-3">
                  <div className="card-body border rounded-top rounded-bottom ">
                    <div className="row">
                      <div className="col-md-1">
                        <Image src="/icon/map.svg" width={15} height={15} />
                      </div>
                      <div className="col-md-8">
                        <h6>{row.loc_name}</h6>
                      </div>
                      <div className="col-md-3">
                        <span className="ml-4">{row.lc_count}</span>
                        <i className="fa fa-angle-right ml-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
