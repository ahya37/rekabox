import Link from "next/link";
import cx from "classnames";

export default function MenuItem(props) {
  const { title, href = "/", active, icon, type } = props;
  const classTitle = cx({
    active,
  });

  const classType = "";
  if (type === "menu") {
    classType = "iq-waves-effect";
  } else {
    classType = "iq-waves-effect text-white";
  }

  return (
    <li className={classTitle}>
      <Link href={href}>
        <a className={classType}>
          <i className={icon}></i>
          <span>{title}</span>
        </a>
      </Link>
    </li>
  );
}
