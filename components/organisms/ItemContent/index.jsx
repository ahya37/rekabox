import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import ShowDetailItem from "./ShowDetailItem";
import ShowItem from "./ShowItem";

export default function ItemContent(props) {
  const router = useRouter();
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12 col-sm-12">
          <div className="iq-card">
            <div className="iq-card-body d-flex justify-content-between">
              <div className="col-md-10 col-sm-10">
                <div className="iq-header-title">
                  <h4>Item</h4>
                </div>
              </div>
              <div className="col-md-2 col-sm-2 ">
                <Button
                  variant="primary"
                  className="float-right"
                  onClick={() => router.push("/team/item/add")}
                >
                  <i className="fa fa-plus"></i>
                  Tambah
                </Button>
              </div>
            </div>
            <div className="iq-card-body">
              <div className="row">
                <ShowItem />
                <ShowDetailItem />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
