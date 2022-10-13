import Link from "next/link";
export default function Header() {
  return (
    <header id="header">
      <div className="container">
        <div id="logo" className="pull-left">
          <h1>
            <Link href="/">
              <a className="scrollto">RekaBox</a>
            </Link>
          </h1>
          <a href="/">
            <img src="/ilustrations/img/logo.png" alt="" title="" />
          </a>
        </div>

        <nav id="nav-menu-container">
          <ul className="nav-menu">
            <li className="menu-active">
              <a href="#intro">Home</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href="#team">Team</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
