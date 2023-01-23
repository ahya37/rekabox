import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function TableRow(props) {
  const { it_idx, it_name, it_serial_number, it_image, ic_count } = props;
  const [image, setImage] = useState("");

  useEffect(() => {
    setImage(it_image);
  });
  const IMG = process.env.NEXT_PUBLIC_IMG;

  const onClickItem = () => {};

  return (
    <tr onClick={onClickItem}>
      <td>
        {image !== "NULL" ? (
          <img src={`${IMG}/${image}`} width={50} height={50} />
        ) : (
          <Image src="/icon/broken_image.svg" width={50} height={50} />
        )}
      </td>
      <td>
        <h6>{it_name}</h6>
        <small>{it_serial_number}</small>
      </td>
      <td>{ic_count}</td>
    </tr>
  );
}
