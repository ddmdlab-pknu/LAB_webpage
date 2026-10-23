import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MENU } from "./ui";

function Nav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const groupOn = (g: (typeof MENU)[number]) =>
    pathname.startsWith("/" + g.href.split("/")[1]) || g.items.some((i) => pathname.startsWith(i.href));

  return (
    <div className="navwrap">
      <nav className="nav" aria-label="주 메뉴">
        <Link className="logo" to="/" aria-label="DDMD Lab 처음으로">
          <i className="mark" aria-hidden="true" />
          DDMD Lab
        </Link>
        <ul className="links">
          {MENU.map((g) => (
            <li key={g.label}>
              <Link to={g.href} className={groupOn(g) ? "on" : ""}>
                {g.label}
              </Link>
              {g.items.length > 0 && (
                <ul className="drop">
                  {g.items.map((i) => (
                    <li key={i.href}>
                      <Link to={i.href} className={pathname === i.href ? "on" : ""}>
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <Link className="contact" to="/about/Location">
          Contact
        </Link>
        <button
          className="menu"
          type="button"
          aria-expanded={open}
          aria-controls="mnav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>
      <div className="mnav" id="mnav" hidden={!open}>
        {MENU.map((g) => (
          <section key={g.label}>
            <b>{g.label}</b>
            {(g.items.length ? g.items : [{ label: g.label, href: g.href }]).map((i) => (
              <Link key={i.href} to={i.href} className={pathname === i.href ? "on" : ""}>
                {i.label}
              </Link>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

export default Nav;
