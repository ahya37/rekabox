import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { setDeleteCategory } from "../../../services/category";

export default function TableRow(props) {
  const { cat_idx, cat_name, cat_desc } = props;

  const router = useRouter();

  const onDelete = (value) => {
    const token = Cookies.get("token");
    const useForm = {
      value,
      token,
    };
    const data = new FormData();
    data.append("cat_idx", useForm.value);
    data.append("token", useForm.token);

    Swal.fire({
      text: `Hapus Kategori ${cat_name} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await setDeleteCategory(data, token);
        if (response.error) {
          Swal.fire(response.message, "", "error");
        } else {
          Swal.fire("Terhapus", "", "success");
          router.push("/team/category");
        }
      }
    });
  };

  return (
    <tr>
      <td>{cat_name}</td>
      <td>{cat_desc}</td>
      <td>
        <Button
          variant="default"
          className="btn btn-sm"
          onClick={() => router.push(`/team/category/${cat_idx}`)}
        >
          <i className="fa fa-edit" aria-hidden="true"></i>
        </Button>
        <Button
          variant="default"
          className="btn btn-sm"
          onClick={() => onDelete(cat_idx)}
        >
          <i className="fa fa-trash" aria-hidden="true"></i>
        </Button>
      </td>
    </tr>
  );
}
