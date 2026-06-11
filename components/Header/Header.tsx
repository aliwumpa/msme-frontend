"use client";

import { useLoginStore } from "@/store/useStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type HeaderProps = {
  setIsLeaving?: (value: boolean) => void;
};

const Header = ({ setIsLeaving }: HeaderProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const role = useLoginStore((state) => state.role);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
  ];

  const getActiveClass = (path: string) => {
    return pathname === path ? "active" : "";
  };

  const handleSignOut = () => {
    setIsLeaving?.(true);
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
        <div className="header__profile header__profile-desktop">
          <span>
            Login as {role ? role.charAt(0).toUpperCase() + role.slice(1) : "-"}
          </span>
          <span className="header__sign-out" onClick={handleSignOut}>
            Sign out
          </span>
        </div>
        <button className="header__hamburger" onClick={toggleMobileMenu}>
          {[...Array(3)].map((_, idx) => (
            <span key={idx}></span>
          ))}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="header__mobile-menu">
          <div className="header__profile">
            <span>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
            <span className="header__sign-out" onClick={handleSignOut}>
              Sign out
            </span>
          </div>
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
