import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { HistoryContent, Navbar, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";
import { getListHistories } from "../../../services/history";
import { ClearRedux } from "../../../services/redux";
import { getReportInventory } from "../../../services/report";

export default function History(props) {
  const { dataHistories, dataReport } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "SET_LIST_HISTORIES", value: dataHistories });
    dispatch({
      type: "SET_DATA_REPORT",
      value: dataReport,
    });
  }, []);

  useEffect(() => {
    dispatch(ClearRedux());
  }, []);

  return (
    <div className="wrapper">
      <Sidebar activeMenu="history" />
      <div id="content-page" className="content-page">
        <Navbar />
        <HistoryContent />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;

  const data = { token };

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
