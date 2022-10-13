import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { getDetailBundle, setDeleteBundleDetail } from "services/purchase";
import Swal from "sweetalert2";
import { LinkedItem, Navbar, Number, Sidebar } from "../../../components";
import { getChekAuth } from "../../../services/auth";

export default function DetailBundle({ detailBundle }) {
  const [isLoading, setIsLoading] = useState(false);

  const IMG = process.env.NEXT_PUBLIC_IMG;
  const router = useRouter();
  const token = Cookies.get("token");

  const onDelete = (value) => {
    const data = new FormData();
    data.append("token", token);
    data.append("ib_idx", value);

    Swal.fire({
      text: `Hapus Bundel?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await setDeleteBundleDetail(data, token);
        setIsLoading(false);
        if (response.error) {
          Swal.fire(response.message, "", "error");
        } else {
          Swal.fire("Terhapus", "", "success");
          router.push("/team/bundle");
        }
      }
    });
  };

  const onEditListItem = (idx) => {
    router.push(`/team/bundle/edit-relation/${idx}`);
  }

  return (
    <div className="wrapper">
      <Sidebar activeMenu="bundle" />
      <div id="content-page" className="content-page">
        <Navbar />
        <div className="container-fluid">
          <div className="iq-card">
            <div className="iq-card-body">
              <Row>
                <Col md={12} className="mb-3">
                  <span>Pembelian & Penjualan</span>
                  <h4 className="card-title text-primary">Detail Bundel</h4>
                </Col>
                <Col md={7}>
                  <Row>
                    <Col md={5}>
                      <h6>
                        <strong>Info Bundel</strong>
                      </h6>
                    </Col>
                    <Col md={7}>
                      <div
                        className="float-right"
                        style={{ cursor: "pointer" }}
                        title="Hapus Bundel"
                      >
                        <i
                          className="fa fa-trash"
                          onClick={() => onDelete(detailBundle.bundle.ib_idx)}
                        ></i>
                      </div>
                      <div
                        className="float-right mr-4"
                        style={{ cursor: "pointer" }}
                        title="Copy Bundel"
                      >
                        <i className="fa fa-copy" onClick={() => router.push(`/team/bundle/copy/${detailBundle.bundle.ib_idx}`)}></i>
                      </div>
                      <div
                        className="float-right mr-4"
                        style={{ cursor: "pointer" }}
                        title="Edit Bundel"
                      >
                        <i className="fa fa-pencil" onClick={() => router.push(`/team/bundle/edit/${detailBundle.bundle.ib_idx}`)}></i>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="border-top p-1 m-2"></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={3}>Nama Bundel</Col>
                    <Col md={9}>{detailBundle.bundle.ib_name}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={3}>Barcode</Col>
                    <Col md={9}>{detailBundle.bundle.ib_barcode}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={3}>Biaya</Col>
                    <Col md={9}>
                      <Number value={detailBundle.bundle.ib_cost} />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={3}>Harga</Col>
                    <Col md={9}>
                      <Number value={detailBundle.bundle.ib_price} />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={3}>Note</Col>
                    <Col md={9}>{detailBundle.bundle.ib_note ?? "-"}</Col>
                  </Row>
                  <Row className="mt-4 border-top m-0">
                    <Button
                      variant="default border mt-3 p-2"
                      onClick={() => router.push("/team/bundle")}
                    >
                      Kembali
                    </Button>
                  </Row>
                </Col>
                <Col md={5}>
                  <Row>
                    <Col md={5}>
                      <h6>
                        <strong>Item Terkait</strong>
                      </h6>
                    </Col>
                    <Col md={7}>
                      <div
                        className="float-right mr-4"
                        style={{ cursor: "pointer" }}
                        title="Edit Bundel"
                      >
                        <i className="fa fa-pencil" onClick={() => onEditListItem(detailBundle.bundle.ib_idx)}></i>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="border-top p-1 m-2"></Col>
                  </Row>
                  <LinkedItem data={detailBundle.detailBundle} />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, params }) {
  const { token } = req.cookies;
  const { branch } = req.cookies;
  const idx = params.idx;

  const auth = await getChekAuth(token);

  if (auth.error || !token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const result = await getDetailBundle(token, branch, idx);

  return {
    props: {
      detailBundle: result.data.data,
    },
  };
}
