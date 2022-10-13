import { useState } from "react";
import { useDispatch } from "react-redux";

export default function StockOutForm(props) {
  const [color, setColor] = useState("card shadow");
  const IMG = process.env.NEXT_PUBLIC_IMG;
  const { item,brMode } = props;

  const dispatch = useDispatch();

  const onSelected = (row, e) => {
    dispatch({ type: "SET_DETAIL_ITEM", value: row });
  };

  if (props.item.length === 0) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              {brMode === 'Basic' ? (
                <h6 className="text-center">Tidak ada item</h6>
              ) : (
              <h6 className="text-center">Pilih lokasi terlebih dulu</h6>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="row">
        {item.map((row) => (
          <div className="col-md-12 mt-2" key={row.it_idx}>
            <div
              className={color}
              htmlFor={row.it_idx}
              onClick={(e) => onSelected(row, e)}
            >
              <div className="card-body" id={row.it_idx}>
                <div className="row">
                  <div className="col-md-2">
                    {row.it_image !== "NULL" ? (
                      <img
                        src={`${IMG}/${row.it_image}`}
                        width="50"
                        height="50"
                      />
                    ) : (
                      <img
                        src="/icon/broken_image.svg"
                        width="50"
                        height="50"
                      />
                    )}
                  </div>
                  <div className="col-md-8">
                    <h6>
                      {row.it_name}
                      <br />
                      <small>{row.loc_name}</small>
                      <br />
                      <small>{row.it_serial_number}</small>
                    </h6>
                  </div>
                  <div className="col-md-2 mt-2">{row.ic_count}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
