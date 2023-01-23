import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { setDeleteLocation } from "../../../services/location";

export default function TableRow(props) {
  const { loc_idx, loc_name, loc_desc } = props;

  const onDelete = (value) => {
    const token = Cookies.get("token");
    const useForm = {
      value,
      token,
    };
    const data = new FormData();
    data.append("loc_idx", useForm.value);
    data.append("token", useForm.token);

    Swal.fire({
      text: `Hapus Lokasi ${loc_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await setDeleteLocation(data, token);
        if (response.error) {
          Swal.fire(response.message, "", "error");
        } else {
          Swal.fire("Terhapus", "", "success");
          router.push("/team/location");
        }
      }
    });
  };

  const router = useRouter();

  return (
    <tr>
      <td>{loc_name}</td>
      <td>{loc_desc}</td>
      <td>
        <Button
          variant="default"
          className="btn btn-sm"
          onClick={() => router.push(`/team/location/${loc_idx}`)}
        >
          <i className="fa fa-edit" aria-hidden="true"></i>
        </Button>
        <Button
          variant="default"
          className="btn btn-sm"
          onClick={() => onDelete(loc_idx)}
        >
          <i className="fa fa-trash" aria-hidden="true"></i>
        </Button>
      </td>
    </tr>
  );
}
