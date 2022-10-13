import MenuItem from "./MenuItem";

export default function MenuItemDropDown(props) {
  const { activeMenu } = props;
  const { title, active, icon, name, data } = props;


  return (
    <li>
      <a
        href={`#${name}`}
        className="iq-waves-effect collapsed"
        data-toggle="collapse"
        aria-expanded="false"
      >
        <i className={icon}></i>
        <span>{title}</span>
      </a>
      <ul
        id={name}
        className="iq-submenu collapse "
        data-parent="#iq-sidebar-toggle"
      >
        {data.map((menu) => (
          <MenuItem
            key={menu.menu_id}
            title={menu.menu}
            href={menu.link}
            active={activeMenu === active}
            type="submenu"
          />
        ))}
      </ul>
    </li>
  );
}
