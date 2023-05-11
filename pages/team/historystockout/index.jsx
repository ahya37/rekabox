import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navbar, Sidebar, HistoryStockOutContent } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { getListHistories } from "../../../services/history";
import { ClearRedux } from "../../../services/redux";
import { getReportInventory } from "../../../services/report";
import { setListHistories } from "redux/action/history";
import { setDataReport } from "redux/action/history";

export default function HistoryStockout(props) {
  const { dataHistories, dataReport } = props;


  let newDataHistories = [];
  dataHistories.map((m) => {
    if (m.in_status === 'Stok Keluar')
    newDataHistories.push({
          in_count: m.in_count,
          in_create:m.in_create,
          in_create_at: m.in_create_at,
          in_idx: m.in_idx,
          in_status: m.in_status,
          in_time: m.in_time,
          loc_name: m.loc_name,
          user_fullname: m.user_fullname
      });
  });


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setListHistories(newDataHistories));
    dispatch(setDataReport(dataReport));
  }, []);

  useEffect(() => {
    dispatch(ClearRedux());
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="history" />
      <div id="content-page" className="content-page">
        <Navbar />
        <HistoryStockOutContent />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;
  const { branch } = req.cookies;

  const data = { token, branch };

  const auth = await getChekAuth(token);

  if (auth.error || !token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const response = await getListHistories(data, token);
  const responseReport = await getReportInventory(data, token);
  return {
    props: {
      dataHistories: response?.data.data.histories,
      dataReport: responseReport?.data.data.report,
    },
  };
}
