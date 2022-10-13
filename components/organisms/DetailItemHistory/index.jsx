import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useCallback, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getDetailHistoryByLocation } from "../../../services/item";

export default function DetailItemHistory() {
  const [isLoading, setIsLoading] = useState(false);

  const { historyByLocation, detailHistoryByLocation } = useSelector(
    (state) => state.itemReducer
  );

  const count = historyByLocation.count;
  const histories = detailHistoryByLocation;

  const dispatch = useDispatch();

  const onLoadHistory = useCallback(async (value) => {
    const token = Cookies.get("token");
    const lc_itidx = value.lc_itidx;
    const lc_loidx = value.lc_loidx;
    const useForm = {
      token,
    };
    data = new FormData();
    data.append("token", useForm.token);
    setIsLoading(true);
    const response = await getDetailHistoryByLocation(
      lc_itidx,
      lc_loidx,
      data,
      token
    );
    setIsLoading(false);
    dispatch({
      type: "SET_DETAIL_HISTORY",
      value: response?.data.data.histories,
    });
  }, []);

  function IconStock(props) {
    const { status } = props;
    if (status === "Stok Masuk") {
      return (
        <Image src="/ilustrations/arrrow-down.svg" width={30} height={20} />
      );
    }
    if (status === "Stok Keluar") {
      return <Image src="/ilustrations/arrow-up.svg" width={30} height={20} />;
    }
    if (status === "Stok Pindah") {
      return (
        <Image src="/ilustrations/arrow-right.svg" width={30} height={20} />
      );
    }
    if (status === "Audit") {
      return (
        <Image src="/ilustrations/arrows-updown2.svg" width={30} height={20} />
      );
    }
  }

  return (
    <div className="col-md-5">
      <div className="card-body shadow">
        <h5 className="text-center">Quantity Saat Ini dan Histori</h5>
        <div className="col-md-12 text-center mt-4">
          {count ? <h1>{count.lc_count}</h1> : <h1>0</h1>}
        </div>
        <div className="col-md-12 text-center">
          <h5>
            <Image src="/icon/map.svg" width={15} height={15} />{" "}
            {count ? count.loc_name : ""}
          </h5>
        </div>
        <div className="col-md-12 text-center">
          <div
            className="btn-group  btn-group-sm mt-3 w-100"
            role="group"
            aria-label="Basic example"
          >
            <Link href="/team/stockin">
              <a className="btn btn-deault border">Masuk</a>
            </Link>
            <Link href="/team/stockout">
              <a className="btn btn-deault border">Keluar</a>
            </Link>
            <Link href="/team/audit">
              <a className="btn btn-deault border">Audit</a>
            </Link>
            <Link href="/team/stockmove">
              <a className="btn btn-deault border">Pindah</a>
            </Link>
          </div>
        </div>
        <div className="border mt-4"></div>

        {isLoading ? (
          <div className="row">
            <div className="col-md-12 mt-4 text-center">
              <Spinner
                as="span"
                animation="border"
                size="md"
                role="status"
                aria-hidden="true"
              />
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-12 mt-4 text-center">
              <div className="col-md-12 mt-4">
                {count ? (
                  <Button
                    variant="default"
                    className="border"
                    onClick={() => onLoadHistory(count)}
                  >
                    <i className="fa fa-plus"></i>Tampilkan Histori
                  </Button>
                ) : (
                  <span>Pilih lokasi</span>
                )}
              </div>
            </div>

            {histories.map((history) => (
              <Fragment key={history.in_idx}>
                <div className="col-md-8">
                  <div className="iq-info-box d-flex align-items-center p-3">
                    <div className="info-image mr-3">
                      <IconStock status={history.in_status} />
                    </div>
                    <div className="info-text">
                      <h6>{history.in_status}</h6>
                      <h6>{history.in_create}</h6>
                      <h6>{history.user_fullname}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="iq-info-box d-flex align-items-center p-3">
                    <div className="info-text">
                      <h6>{history.in_count}</h6>
                      <span>
                        {history.in_count_first}
                        <i className="fa fa-arrow-right"></i>
                        {history.in_count_last}
                      </span>
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
