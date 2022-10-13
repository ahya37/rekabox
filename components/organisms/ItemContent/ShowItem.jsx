import Cookies from "js-cookie";
import Image from "next/image";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getLocationByItem } from "../../../services/item";
import { FormSelectLocation } from "../../molecules";

export default function ShowItem() {
  const IMG = process.env.NEXT_PUBLIC_IMG;

  const { selectItemLocation } = useSelector((state) => state.itemReducer);

  const item = selectItemLocation;

  const dispatch = useDispatch();

  const onSelectDetail = async (list) => {
    dispatch({ type: "SET_DETAIL_ITEM", value: list });
    const it_idx = list.it_idx;
    const token = Cookies.get("token");
    const useForm = {
      token,
    };

    const data = new FormData();
    data.append("token", useForm.token);

    const location = await getLocationByItem(it_idx, data, token);
    dispatch({
      type: "SET_LOCATION_BY_ITEM",
      value: location?.data.data.lokasi,
    });
  };

  return (
    <div className="col-md-6 border-top">
      <div className="row mt-3">
        <div className="col-md-12"></div>
      </div>
      <FormSelectLocation />
      <div className="row mt-3">
        {item.map((list) => (
          <Col md={12} onClick={() => onSelectDetail(list)} key={list.lc_idx}>
            <div className="border-top border-bottom">
              <div className="mt-2 ml-2">
                <Row>
                  <Col md={2}>
                    {list.it_image !== "NULL" ? (
                      <img
                        src={`${IMG}/${list.it_image}`}
                        width="50"
                        height="50"
                        className="rounded-top rounded-bottom"
                      />
                    ) : (
                      <Image
                        src="/icon/broken_image.svg"
                        width={50}
                        height={50}
                        className="rounded-top rounded-bottom"
                      />
                    )}
                  </Col>
                  <Col md={8}>
                    <h6>
                      {list.it_name}
                      <br />
                      <small>{list.loc_name}</small>
                      <br />
                      <small>{list.it_serial_number}</small>
                    </h6>
                  </Col>
                  <Col md={2} className="py-4 font-weight-bold text-primary">
                    {list.ic_count}
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        ))}
      </div>
    </div>
  );
}
