import FileSaver from "file-saver";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";

const ExportExcel = ({ fileName }) => {
  let { dataReport } = useSelector((state) => state.HistoryReducer);

  const wscols = [
    {
      wch: Math.max(...dataReport.map((m) => m?.trx_id.length)),
    },
    {
      wch: Math.max(...dataReport.map((m) => m?.trx_type.length)),
    },
    {
      wch: Math.max(...dataReport.map((m) => m?.loc_name.length)),
    },
    {
      wch: Math.max(...dataReport.map((m) => m?.trx_time.length)),
    },
    {
      wch: Math.max(...dataReport.map((m) => m?.create_by.length)),
    },
    {
      wch: Math.max(...dataReport.map((m) => m?.note.length)),
    },
    {
      wch: Math.max(...dataReport.map((m) => m?.barcode.length)),
    },
    {
      wch: Math.max(...dataReport.map((m) => m?.name.length)),
    },
    {
      wch: Math.max(...dataReport.map((m) => m?.qty.length)),
    },
    {
      wch: Math.max(...dataReport.map((m) => m?.balance_before.length)),
    },
    {
      wch: Math.max(...dataReport.map((m) => m?.balance_after.length)),
    },
  ];

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const Heading = [
    {
      trx_id: "ID Transaksi",
      trx_type: "Type Transaksi",
      loc_name: "Lokasi",
      trx_time: "Waktu Transaksi",
      create_by: "Create By",
      note: "Note",
      barcode: "Barcode",
      name: "Nama",
      qty: "Qty",
      balance_before: "Balance (Before)",
      balance_after: "Balance (After)",
    },
  ];

  const exportToExcel = (dataReport, fileName, wscols) => {
    const ws = XLSX.utils.json_to_sheet(Heading, {
      header: [
        "trx_id",
        "trx_type",
        "loc_name",
        "trx_time",
        "create_by",
        "note",
        "barcode",
        "name",
        "qty",
        "balance_before",
        "balance_after",
      ],
      skipHeader: true,
      origin: 0, //ok
    });
    ws["!cols"] = wscols;
    XLSX.utils.sheet_add_json(ws, dataReport, {
      header: [
        "trx_id",
        "trx_type",
        "loc_name",
        "trx_time",
        "create_by",
        "note",
        "barcode",
        "name",
        "qty",
        "balance_before",
        "balance_after",
      ],
      skipHeader: true,
      origin: -1, //ok
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button
      variant="default border"
      className="float-right"
      onClick={(e) => exportToExcel(dataReport, fileName, wscols)}
    >
      <i className="fa fa-arrow-down"></i> Export Excel
    </Button>
  );
};

export default ExportExcel;
