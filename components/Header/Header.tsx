"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Header = () => {
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/",
    },
  ];

  const getActiveClass = (path: string) => {
    return pathname === path ? "active" : "";
  };

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__logo">MSME Compliance</h1>

        <nav className="header__nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`header__nav-link ${getActiveClass(item.path)}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="header__right">
        <button className="header__hamburger" onClick={toggleMobileMenu}>
          {[...Array(3)].map((_, idx) => (
            <span key={idx}></span>
          ))}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="header__mobile-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={getActiveClass(item.path)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
