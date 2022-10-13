import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

export default function ShowDetailItem(props) {
  const { detailItem, locationByItem } = useSelector(
    (state) => state.itemReducer
  );

  const { it_idx, it_name, it_serial_number, it_image, lc_loidx, ic_count } =
    detailItem;

  const IMG = process.env.NEXT_PUBLIC_IMG;
  const locations = locationByItem;
  const router = useRouter();
  const dispatch = useDispatch();

  const onDetail = (value) => {
    router.push(`/team/item/${value}`);
    dispatch({ type: "setHistoryByLocation", value: locations[0] });
  };

  return (
    <div className="col-md-6 border-left border-top">
      <div className="row mt-2">
        <div className="col-md-12 mt-2">
          <h5>Detail Item</h5>
        </div>
      </div>
      {!it_idx ? (
        <div className="card-body shadow border-bottom">
          Tidak ada item terpilih
        </div>
      ) : (
        <div className="row mt-3">
          <div className="col-md-12 mt-2 ">
            <div onClick={() => onDetail(it_idx)}>
              <div className="card shadow ">
                <div className="card-body">
                  <div className="row alert alert-secondary">
                    <div className="col-md-2">
                      {it_image !== "NULL" ? (
                        <img
                          src={`${IMG}/${it_image}`}
                          width={50}
                          height={50}
                          className="rounded-top rounded-bottom "
                        />
                      ) : (
                        <Image
                          src="/icon/broken_image.svg"
                          width={50}
                          height={50}
                          className="rounded-top rounded-bottom "
                        />
                      )}
                    </div>
                    <div className="col-md-8">
                      <h6>
                        {it_name}
                        <br />
                        <small>{it_serial_number}</small>
                      </h6>
                    </div>
                    <div className="col-md-2 mt-2">{ic_count}</div>
                  </div>
                </div>
                <div className="card-header bg-white">
                  <div className="row">
                    <div className="col-md-8">
                      <h6>Lokasi</h6>
                    </div>
                  </div>
                </div>
                <div className="card shadow">
                  {locations.map((location) => (
                    <div className="card-body" key={location.lc_loidx}>
                      <div className="row">
                        <div className="col-md-2">
                          <Image src="/icon/map.svg" width={15} height={15} />
                        </div>
                        <div className="col-md-8">
                          <h6>{location.loc_name}</h6>
                        </div>
                        <div className="col-md-2 mt-2">{location.lc_count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
