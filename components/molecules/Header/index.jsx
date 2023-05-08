import Link from "next/link";
export default function Header() {
  return (
    <header id="header">
      <div className="container">
        <div id="logo" className="pull-left">
          <h1>
            <Link href="/" className="scrollto">
              RekaBox
            </Link>
          </h1>
          <a href="/">
            <img src="/ilustrations/img/logo.png" alt="" title="" />
          </a>
        </div>

        <nav id="nav-menu-container">
          <ul className="nav-menu">
            <li className="menu-active">
              <a href="/">Home</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
