import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { setUpdateStatusUsers } from "../../../services/users";

export default function TableRow(props) {
  const { level, email, fullName, userId, phone, image, status } = props;

  const IMG = process.env.NEXT_PUBLIC_IMG;
  const router = useRouter();

  const onStatus = (value) => {
    const token = Cookies.get("token");
    const useForm = {
      value,
      token,
    };

    const data = new FormData();
    data.append("userid", useForm.value);
    data.append("token", useForm.token);

    const swalTitle = status == "Aktif" ? "Non Aktifkan" : "Aktifkan";

    Swal.fire({
      text: ` ${swalTitle} Pengguna ${fullName} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await setUpdateStatusUsers(data, token);
        if (response.error) {
          Swal.fire(response.message, "", "error");
        } else {
          Swal.fire("Update", "", "success");
          router.push("/team/users");
        }
      }
    });
  };

  return (
    <tr>
      <td>
        {image === "" ? (
          <img src="/img/account.png" width="30" alt="user" />
        ) : (
          <img
            src={`${IMG}/${image}`}
            className="img-fluid rounded"
            alt="user"
            width="30"
          />
        )}
      </td>
      <td>{fullName}</td>
      <td>{phone}</td>
      <td>{email}</td>
      <td>{level}</td>
      <td>{status}</td>
      <td>
        <Button
          variant="default"
          className="btn btn-sm"
          onClick={() => router.push(`/team/users/${userId}`)}
        >
          <i className="fa fa-edit" aria-hidden="true"></i>
        </Button>
        <Button
          variant="default"
          className="btn btn-sm "
          onClick={() => onStatus(userId)}
        >
          {status === "Aktif" ? (
            <i className="fa fa-toggle-on" aria-hidden="true"></i>
          ) : (
            <i className="fa fa-toggle-off" aria-hidden="true"></i>
          )}
        </Button>
        <div className="custom-control custom-switch">
          <input type="checkbox" className="custom-control-input" />
        </div>
      </td>
    </tr>
  );
}
