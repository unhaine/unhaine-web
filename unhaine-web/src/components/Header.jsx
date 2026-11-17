import { useState } from "react";
import { Link, NavLink } from "react-router";

const links = [
  ["/", "Main"],
  ["/about", "About"],
  ["/portfolio", "Portfolio"],
  ["/blog", "Blog"],
  ["/contact", "Contact"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link className="brand" to="/" onClick={() => setOpen(false)}>
        unhaine<span className="star">.</span>
      </Link>
      <nav
        id="main-nav"
        className={`desktop-nav${open ? " open" : ""}`}
        aria-label="주 메뉴"
      >
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={() => setOpen(false)}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        id="menu-toggle"
        className="mobile-toggle"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-controls="main-nav"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>
    </header>
  );
}
