// src/components/sidebar/Sidebar.tsx
import React, { useState } from "react";
import styles from "./Sidebar.module.scss";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faBowlFood,
  faTags,
  faUserGroup,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Floating hamburger (mobile) */}
      <button
        className={styles.mobileFabToggle}
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      <aside
        className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarMobileOpen : ""
          }`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <img
              src="/logo-kansha-hibachi-sushi.png"
              alt="Kansha Hibachi & Sushi"
              className={styles.logo}
            />
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Kansha Admin</span>
              <span className={styles.brandSubtitle}>Hibachi &amp; Sushi</span>
            </div>
          </div>

          <button
            className={styles.mobileCloseButton}
            onClick={toggleMobileSidebar}
            aria-label="Close sidebar"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
            onClick={closeMobileSidebar}
          >
            <FontAwesomeIcon icon={faGaugeHigh} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/product"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
            onClick={closeMobileSidebar}
          >
            <FontAwesomeIcon icon={faBowlFood} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/category"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
            onClick={closeMobileSidebar}
          >
            <FontAwesomeIcon icon={faTags} />
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/user"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
            onClick={closeMobileSidebar}
          >
            <FontAwesomeIcon icon={faUserGroup} />
            <span>Users</span>
          </NavLink>
        </nav>
      </aside>

      {/* Overlay */}
      <div
        className={`${styles.mobileOverlay} ${isMobileOpen ? styles.mobileOverlayVisible : ""
          }`}
        onClick={closeMobileSidebar}
      />
    </>
  );
};

export default Sidebar;