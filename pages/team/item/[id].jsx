import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import {
  Navbar,
  Sidebar,
  DetailItemHistory,
  DetailItemInfo,
} from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { getDetailItem } from "../../../services/item";

export default function DetailItem(props) {
  const [data, setData] = useState({});
  const [location, setLocation] = useState([]);
  const { idx } = props;

  const getDetailItemApi = useCallback(async (idx, token) => {
    const response = await getDetailItem(idx, token);
    setData(response.data.data.item);
    setLocation(response.data.data.location);
  }, []);
  useEffect(() => {
    const token = Cookies.get("token");
    getDetailItemApi(idx, token);
  }, []);

  return (
    <>
      <div className="wrapper">
        <Sidebar activeMenu="item" />
        <div id="content-page" className="content-page">
          <Navbar />
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <DetailItemInfo
                        item={data}
                        location={location}
                        idx={idx}
                      />
                      <DetailItemHistory />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, params }) {
  const idx = params.id;
  const { token } = req.cookies;

  const auth = await getChekAuth(token);

  if (auth.error || !token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: { idx },
  };
}
