import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranch } from "../../../services/branch";
import { getMenu } from "../../../services/users";
import { SelectBranch } from "../../organisms";
import MenuItem from "./MenuItem";
import MenuItemDropDown from "./MenuItemDropDown";

export default function Sidebar(props) {
  const { activeMenu } = props;
  const { listMenu } = useSelector((state) => state.MenuReducer);
  const [allBranch, setAllBranch] = useState([]);
  const [branch, setBranch] = useState({
    br_name: ""
  });

  const dispatch = useDispatch();

  const getMenuAPI = useCallback(async (token,branch) => {
    const response = await getMenu(token,branch);
    dispatch({ type: "SET_MENU", value: response.data.data.menu });
  }, []);

  const getAllBranchAPI = useCallback(async (token) => {
   const result = await getAllBranch(token);
   setAllBranch(result.data.data.branchs);
  },[]);

  useEffect(() => {
    const dataBranch = localStorage.getItem('branch');
    setBranch(JSON.parse(dataBranch));
    const token = Cookies.get("token");
    const branch = Cookies.get("branch");
    getMenuAPI(token, branch);
    getAllBranchAPI(token);
  }, []);



  return (
    <div className="iq-sidebar">
      <div className="iq-sidebar-logo d-flex justify-content-between">
        <a href="index.html">
          <span>RekaBox</span>
        </a>
        <div className="iq-menu-bt-sidebar">
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
        </div>
      </div>
      <div id="sidebar-scrollbar">
        <nav className="iq-sidebar-menu">
          <ul id="iq-sidebar-toggle" className="iq-menu">
            <li className="mb-2">
              <SelectBranch branch={branch} data={allBranch} />
            </li>
            {listMenu.map((menu) =>
              menu.link !== "#" ? (
                <MenuItem
                  key={menu.id}
                  icon={menu.icon}
                  title={menu.name}
                  href={menu.link}
                  active={activeMenu === menu.active}
                  type="menu"
                />
              ) : (
                <MenuItemDropDown
                  key={menu.id}
                  icon={menu.icon}
                  title={menu.name}
                  data={menu.submenu}
                  name={menu.active}
                  active={activeMenu === menu.active}
                />
              )
            )}
          </ul>
        </nav>
        <div className="p-3"></div>
      </div>
    </div>
  );
}
