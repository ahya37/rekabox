import Profile from "./Profile";
import Search from "./Search";

export default function Navbar() {
  return (
    <div className="iq-top-navbar">
      <div className="iq-navbar-custom">
        <div className="iq-sidebar-logo">
          <div className="top-logo">
            <a href="index.html" className="logo">
              <span>RekaBox</span>
            </a>
          </div>
        </div>
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          <div className="iq-menu-bt align-self-center">
            <div className="wrapper-menu">
              <div className="main-circle">
                <i className="ri-more-fill"></i>
              </div>
              <div className="hover-circle">
                <i className="ri-more-2-fill"></i>
              </div>
            </div>
          </div>
          <Profile />
        </nav>
      </div>
    </div>
  );
}
