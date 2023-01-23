import { Button } from "react-bootstrap";

export default function BarcodeScanner() {
  return (
    <Button variant="default" className="border float-right">
      <i className="fa fa-barcode" aria-hidden="true"></i>
      Barcode Scanner
    </Button>
  );
}
