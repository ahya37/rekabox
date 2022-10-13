import Link from "next/link";

export default function Menu(props) {
  const { href, title } = props;
  return (
    <Link href={href}>
      <a className="btn btn-default border ml-2">{title}</a>
    </Link>
  );
}
